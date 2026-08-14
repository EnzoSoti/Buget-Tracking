import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  StatusBar
} from 'react-native';

const getTodayString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Returns short day name (e.g. "Sat")
const getDayNameStr = (dateStr) => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  } catch (e) {
    return '';
  }
};

const isSunday = (dateStr) => getDayNameStr(dateStr) === 'Sun';
const isSaturday = (dateStr) => getDayNameStr(dateStr) === 'Sat';

// Get total paid workdays in a given month (all days except Sundays)
const getWorkdaysInMonth = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let workdays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    if (dayOfWeek !== 0) { // Not Sunday
      workdays++;
    }
  }
  return workdays;
};

// Get daily rate based on monthly net salary of 21,000 divided by total paid workdays in that month
const getDailyRateForDate = (dateStr, monthlySalary = 21000) => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const workdays = getWorkdaysInMonth(y, m - 1);
    return workdays > 0 ? monthlySalary / workdays : 0;
  } catch (e) {
    return monthlySalary / 26;
  }
};

// Generate array of date strings between start and end date (inclusive)
const getDateRangeArray = (startStr, endStr) => {
  const dates = [];
  try {
    const [sY, sM, sD] = startStr.split('-').map(Number);
    const [eY, eM, eD] = endStr.split('-').map(Number);
    
    let cur = new Date(sY, sM - 1, sD);
    const end = new Date(eY, eM - 1, eD);
    
    while (cur <= end && dates.length < 60) {
      const year = cur.getFullYear();
      const month = String(cur.getMonth() + 1).padStart(2, '0');
      const day = String(cur.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
      cur.setDate(cur.getDate() + 1);
    }
  } catch (e) {
    console.error(e);
  }
  return dates;
};

export default function App() {
  // Map of Date -> Income Amount
  const [dailySalaries, setDailySalaries] = useState({});
  const [expenses, setExpenses] = useState([]);
  
  // Customizable Default Daily Income for Daily Budget Calculator
  const [defaultDailyIncome, setDefaultDailyIncome] = useState('700');
  
  // Date Range Selection State for Cut-off Salary Calculator
  const [cutoffStart, setCutoffStart] = useState('2026-07-11');
  const [cutoffEnd, setCutoffEnd] = useState('2026-07-25');
  
  // Selected Single Date within or outside range
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Custom divisor base pay setup
  const [cutoffBasePay, setCutoffBasePay] = useState('10500');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  
  // Map of Date -> Attendance Status ('FULL', 'SAT_FULL', 'HALF', 'ABSENT', 'REST_DAY')
  const [attendanceMap, setAttendanceMap] = useState({});
  
  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Theme
  const [isDark, setIsDark] = useState(true);

  // Edit Expense Modal
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState(getTodayString());

  // Load Saved Data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rn_daily_budget_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailySalaries && typeof parsed.dailySalaries === 'object') {
          setDailySalaries(parsed.dailySalaries);
        }
        if (Array.isArray(parsed.expenses)) {
          setExpenses(parsed.expenses);
        }
        if (typeof parsed.isDark === 'boolean') {
          setIsDark(parsed.isDark);
        }
        if (parsed.attendanceMap) {
          setAttendanceMap(parsed.attendanceMap);
        }
        if (parsed.defaultDailyIncome) setDefaultDailyIncome(parsed.defaultDailyIncome);
        if (parsed.cutoffBasePay) setCutoffBasePay(parsed.cutoffBasePay);
        if (parsed.cutoffStart) setCutoffStart(parsed.cutoffStart);
        if (parsed.cutoffEnd) setCutoffEnd(parsed.cutoffEnd);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save Data helper
  const saveData = (newDailySalaries, newExpenses, newIsDark, newAttMap = attendanceMap, extra = {}) => {
    try {
      localStorage.setItem('rn_daily_budget_data', JSON.stringify({
        dailySalaries: newDailySalaries,
        expenses: newExpenses,
        isDark: newIsDark,
        attendanceMap: newAttMap,
        defaultDailyIncome,
        cutoffBasePay,
        cutoffStart,
        cutoffEnd,
        ...extra
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // Format Currency
  const formatPeso = (num) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Date Navigation for single date filter
  const changeDateByDays = (days) => {
    const parts = selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + days);
    const newStr = getTodayString(current);
    setSelectedDate(newStr);
    setExpenseDate(newStr);
  };

  // Resolve attendance status for a date
  const getResolvedStatus = (dateStr) => {
    if (attendanceMap[dateStr]) return attendanceMap[dateStr];
    if (isSunday(dateStr)) return 'REST_DAY';
    if (isSaturday(dateStr)) return 'SAT_FULL';
    return 'FULL';
  };

  // --- INDEPENDENT CUT-OFF SALARY CALCULATOR FEATURE ---
  const rangeDates = getDateRangeArray(cutoffStart, cutoffEnd);
  
  let calculatedCutoffSalary = 0;
  let totalScheduledDays = 0;
  let totalAttendedDays = 0;

  rangeDates.forEach(d => {
    const status = getResolvedStatus(d);
    const dailyRate = getDailyRateForDate(d, 21000);

    if (!isSunday(d)) {
      totalScheduledDays += 1.0;
    }

    let multiplier = 0;
    if (status === 'FULL' || status === 'SAT_FULL') {
      multiplier = 1.0;
      totalAttendedDays += 1.0;
    } else if (status === 'HALF') {
      multiplier = 0.5;
      totalAttendedDays += 0.5;
    } else if (status === 'ABSENT' || status === 'REST_DAY') {
      multiplier = 0.0;
    }

    calculatedCutoffSalary += dailyRate * multiplier;
  });

  calculatedCutoffSalary = Math.round(calculatedCutoffSalary * 100) / 100;

  // --- INDEPENDENT DAILY BUDGET CALCULATOR FEATURE ---
  // Active daily income: completely customizable by the user per date, defaulting to defaultDailyIncome
  const currentDateSalary = dailySalaries[selectedDate] !== undefined 
    ? dailySalaries[selectedDate] 
    : (parseFloat(defaultDailyIncome) || 700);

  // Toggle Attendance status when tapping a date row
  const toggleAttendanceStatus = (dateStr) => {
    const current = getResolvedStatus(dateStr);
    let nextStatus = 'FULL';
    
    if (current === 'FULL' || current === 'SAT_FULL') nextStatus = 'HALF';
    else if (current === 'HALF') nextStatus = 'ABSENT';
    else if (current === 'ABSENT') nextStatus = 'REST_DAY';
    else if (current === 'REST_DAY') nextStatus = 'FULL';

    const newAttMap = { ...attendanceMap, [dateStr]: nextStatus };
    setAttendanceMap(newAttMap);
    saveData(dailySalaries, expenses, isDark, newAttMap);
  };

  // Add Expense
  const handleAddExpense = () => {
    const amt = parseFloat(amount);
    if (!name.trim() || isNaN(amt) || amt <= 0) return;

    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: amt,
      date: expenseDate || selectedDate
    };

    const updated = [newItem, ...expenses];
    setExpenses(updated);
    saveData(dailySalaries, updated, isDark);

    setName('');
    setAmount('');
  };

  // Delete Expense
  const handleDelete = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    saveData(dailySalaries, updated, isDark);
  };

  // Open Edit Modal
  const openEdit = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditDate(item.date || selectedDate);
  };

  // Save Edit Modal
  const handleSaveEdit = () => {
    const amt = parseFloat(editAmount);
    if (!editName.trim() || isNaN(amt) || amt <= 0 || !editItem) return;

    const updated = expenses.map(exp => {
      if (exp.id === editItem.id) {
        return {
          ...exp,
          name: editName.trim(),
          amount: amt,
          date: editDate
        };
      }
      return exp;
    });

    setExpenses(updated);
    saveData(dailySalaries, updated, isDark);
    setEditItem(null);
  };

  // Clear All
  const handleClearAll = () => {
    if (expenses.length === 0) return;
    if (confirm('Clear all recorded expenses?')) {
      setExpenses([]);
      saveData(dailySalaries, [], isDark);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    let csv = "Date,Expense Description,Amount (PHP)\n";
    expenses.forEach(exp => {
      csv += `"${exp.date || ''}","${exp.name.replace(/"/g, '""')}",${exp.amount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Salary_Budget_Records.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    saveData(dailySalaries, expenses, next);
  };

  // Expenses filtering
  const dateExpenses = expenses.filter(exp => exp.date === selectedDate);
  const totalDateExpenses = dateExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Remaining Balance for Selected Single Date
  const remainingForDate = currentDateSalary - totalDateExpenses;
  const spentPctForDate = currentDateSalary > 0 ? Math.min(Math.round((totalDateExpenses / currentDateSalary) * 100), 999) : 0;

  const theme = isDark ? darkTheme : lightTheme;

  // Resolve input class depending on theme
  const dateInputClassName = isDark ? "modern-date-input" : "modern-date-input light-theme-picker";

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Modern Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.mainTitle, theme.text]}>💰 Budget Tracker</Text>
            <Text style={[styles.mainSubtitle, theme.subtext]}>Independent Cut-off & Daily Budget Calculator</Text>
          </View>
          <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme} activeOpacity={0.7}>
            <Text style={styles.themeEmoji}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </TouchableOpacity>
        </View>

        {/* HTML div grid wrapper for reliable sideways desktop columns */}
        <div className="responsive-row">
          
          {/* COLUMN 1 */}
          <div className="responsive-col">
            
            {/* FEATURE 1: 💼 CUT-OFF SALARY CALCULATOR CARD */}
            <View style={[styles.cardContainer, theme.card]}>
              <View style={styles.cardHeaderFlexRow}>
                <Text style={[styles.sectionLabel, theme.text]}>💼 Cut-off Salary Calculator</Text>
                <TouchableOpacity style={styles.calcTriggerBtn} onPress={() => setShowAttendanceModal(true)} activeOpacity={0.85}>
                  <Text style={styles.calcTriggerBtnText}>📋 Attendance</Text>
                </TouchableOpacity>
              </View>

              {/* From & To Compact Inputs side-by-side */}
              <View style={styles.twoColumnGrid}>
                <View style={styles.gridColumn}>
                  <Text style={[styles.fieldTitle, theme.subtext]}>Start Date</Text>
                  <input
                    type="date"
                    className={dateInputClassName}
                    value={cutoffStart}
                    onChange={(e) => {
                      if (e.target.value) {
                        setCutoffStart(e.target.value);
                        saveData(dailySalaries, expenses, isDark, attendanceMap, { cutoffStart: e.target.value });
                      }
                    }}
                  />
                </View>

                <View style={styles.gridColumn}>
                  <Text style={[styles.fieldTitle, theme.subtext]}>End Date</Text>
                  <input
                    type="date"
                    className={dateInputClassName}
                    value={cutoffEnd}
                    onChange={(e) => {
                      if (e.target.value) {
                        setCutoffEnd(e.target.value);
                        saveData(dailySalaries, expenses, isDark, attendanceMap, { cutoffEnd: e.target.value });
                      }
                    }}
                  />
                </View>
              </View>

              {/* Computed Salary Banner */}
              <View style={styles.calcSummaryBox}>
                <Text style={styles.calcSummaryLabel}>AUTO-CALCULATED PAY FOR RANGE</Text>
                <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
                <Text style={styles.calcSummarySub}>
                  Based on ₱21,000/mo • {totalAttendedDays} of {totalScheduledDays} Work Days
                </Text>
              </View>
            </View>

            {/* ADD EXPENSE FORM */}
            <View style={[styles.cardContainer, theme.card]}>
              <View style={styles.cardHeaderFlexRow}>
                <Text style={[styles.sectionLabel, theme.text]}>✍️ Add New Expense</Text>
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Date for Expense</Text>
                <input
                  type="date"
                  className={dateInputClassName}
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Expense Description</Text>
                <TextInput
                  style={[styles.textInputFull, theme.btnBg, theme.text]}
                  placeholder="e.g. Groceries, Rice, Internet Bill..."
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Amount (₱)</Text>
                <TextInput
                  style={[styles.textInputFull, theme.btnBg, theme.text]}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <TouchableOpacity style={styles.addExpenseBtn} onPress={handleAddExpense} activeOpacity={0.85}>
                <Text style={styles.addExpenseBtnText}>+ Add Expense to {expenseDate}</Text>
              </TouchableOpacity>
            </View>

          </div>

          {/* COLUMN 2 */}
          <div className="responsive-col">
            
            {/* FEATURE 2: 📊 DAILY EXPENSE CALCULATOR */}
            <View style={[styles.cardContainer, theme.card]}>
              <Text style={[styles.sectionLabel, theme.text]}>📊 Daily Budget Calculator</Text>
              
              {/* Selected Date navigation inside the calculator */}
              <View style={styles.dateControlRow}>
                <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(-1)} activeOpacity={0.7}>
                  <Text style={[styles.dateNavBtnText, theme.text]}>◀ Prev</Text>
                </TouchableOpacity>

                <View style={{ flex: 2 }}>
                  <input
                    type="date"
                    className={dateInputClassName}
                    value={selectedDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        setExpenseDate(e.target.value);
                      }
                    }}
                  />
                </View>

                <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(1)} activeOpacity={0.7}>
                  <Text style={[styles.dateNavBtnText, theme.text]}>Next ▶</Text>
                </TouchableOpacity>
              </View>

              {selectedDate !== getTodayString() && (
                <TouchableOpacity
                  style={styles.todayPill}
                  onPress={() => {
                    const today = getTodayString();
                    setSelectedDate(today);
                    setExpenseDate(today);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.todayPillText}>Jump to Today ({getTodayString()})</Text>
                </TouchableOpacity>
              )}

              {/* Combined Remaining Balance details inside Card 2 */}
              <View style={[
                styles.mainBalanceCardInner,
                remainingForDate < 0 || spentPctForDate > 90 ? styles.innerCardDanger :
                spentPctForDate >= 75 ? styles.innerCardWarning : styles.innerCardSuccess
              ]}>
                <Text style={styles.balanceTag}>REMAINING BUDGET FOR {selectedDate}</Text>
                <Text style={styles.balanceBigNumber}>{formatPeso(remainingForDate)}</Text>

                <View style={styles.balanceMiniRow}>
                  {/* EDITABLE DAILY INCOME AMOUNT WITH CUSTOM INPUT */}
                  <View style={styles.miniStatEditable}>
                    <Text style={styles.miniLabelEditable}>Daily Income (₱) ✏️</Text>
                    <TextInput
                      style={styles.editableSalaryInput}
                      value={dailySalaries[selectedDate] !== undefined ? dailySalaries[selectedDate].toString() : (defaultDailyIncome || '')}
                      onChangeText={(val) => {
                        const parsed = parseFloat(val);
                        const updatedSalaries = { ...dailySalaries };
                        if (val.trim() === '' || isNaN(parsed)) {
                          delete updatedSalaries[selectedDate];
                        } else {
                          updatedSalaries[selectedDate] = parsed;
                        }
                        setDailySalaries(updatedSalaries);
                        saveData(updatedSalaries, expenses, isDark);
                      }}
                      placeholder="0.00"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniLabel}>Spent Today</Text>
                    <Text style={styles.miniValue}>{formatPeso(totalDateExpenses)}</Text>
                  </View>
                </View>

                {/* Animated Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Spent Ratio ({spentPctForDate}%)</Text>
                    <Text style={styles.progressStatusBadge}>
                      {remainingForDate < 0 || spentPctForDate > 90 ? '🔴 Critical' : spentPctForDate >= 75 ? '🟡 Caution' : '🟢 Healthy'}
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <div
                      className="progress-bar-animated"
                      style={{
                        height: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: 99,
                        width: `${Math.min(spentPctForDate, 100)}%`
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* EXPENSE RECORDS LIST */}
            <View style={[styles.cardContainer, theme.card]}>
              <Text style={[styles.sectionLabel, theme.text]}>📋 Expenses for {selectedDate}</Text>

              {dateExpenses.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={{ fontSize: '36px', marginBottom: '6px' }}>🍂</Text>
                  <Text style={[styles.emptyBoxTitle, theme.text]}>No Expenses Logged</Text>
                  <Text style={[styles.emptyBoxText, theme.subtext]}>Tap "+ Add Expense" to log your daily purchases.</Text>
                </View>
              ) : (
                dateExpenses.map(item => (
                  <View key={item.id} style={[styles.expenseRow, theme.btnBg]}>
                    <View style={styles.expenseRowLeft}>
                      <View style={styles.expenseIconWrapper}>
                        <Text style={styles.catEmoji}>💸</Text>
                      </View>
                      <View style={styles.expenseTextInfo}>
                        <Text style={[styles.expNameText, theme.text]}>{item.name}</Text>
                        <Text style={[styles.expDateText, theme.subtext]}>📅 {item.date}</Text>
                      </View>
                    </View>

                    <View style={styles.expenseRowRight}>
                      <Text style={styles.expAmountText}>-{formatPeso(item.amount)}</Text>
                      <TouchableOpacity onPress={() => openEdit(item)} style={[styles.iconAction, theme.btnBg]} activeOpacity={0.6}>
                        <Text style={{ fontSize: 15 }}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.iconAction, theme.btnBg]} activeOpacity={0.6}>
                        <Text style={{ fontSize: 15 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}

              <View style={styles.footerBtnRow}>
                <TouchableOpacity style={styles.exportBtnPrimary} onPress={handleExportCSV} activeOpacity={0.8}>
                  <Text style={styles.exportBtnPrimaryText}>📄 Export CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll} activeOpacity={0.7}>
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>

          </div>

        </div>

        <Text style={[styles.pageFooterText, theme.subtext]}>Enzo Soti &bull; Budget Tracker Pro</Text>

      </ScrollView>

      {/* Attendance & Salary Details Modal */}
      <Modal visible={showAttendanceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, theme.card, { maxHeight: '85%' }]}>
            <View style={styles.modalDragHandle} />
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalHeading, theme.text]}>📋 Cut-off Attendance Sheet</Text>
              <TouchableOpacity onPress={() => setShowAttendanceModal(false)} activeOpacity={0.6}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 14 }} showsVerticalScrollIndicator={false}>
              <View style={[styles.scheduleBanner, theme.btnBg]}>
                <Text style={[styles.scheduleBannerText, theme.text]}>
                  💵 Monthly Net Base Salary: ₱21,000{"\n"}
                  Saturdays = Halfday (Full Pay 1.0x) | Sundays = Rest Day (0x)
                </Text>
              </View>

              <Text style={[styles.fieldTitle, theme.subtext, { marginTop: 4 }]}>
                Daily Cut-off attendance details (Tap row to toggle state)
              </Text>

              {/* Native ScrollView for attendance items */}
              <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={true}>
                {rangeDates.map(dateStr => {
                  const status = getResolvedStatus(dateStr);
                  const dayName = getDayNameStr(dateStr);

                  return (
                    <TouchableOpacity
                      key={dateStr}
                      style={[styles.attRow, theme.btnBg]}
                      onPress={() => toggleAttendanceStatus(dateStr)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.attDateText, theme.text]}>
                        📅 {dateStr} ({dayName})
                      </Text>
                      
                      <View style={[
                        styles.attBadge,
                        status === 'FULL' || status === 'SAT_FULL' ? styles.attFull :
                        status === 'HALF' ? styles.attHalf : styles.attAbsent
                      ]}>
                        <Text style={styles.attBadgeText}>
                          {status === 'SAT_FULL' ? '🟢 Sat (Full Pay)' :
                           status === 'FULL' ? '🟢 Full Day' :
                           status === 'HALF' ? '🟡 Half Day' :
                           status === 'REST_DAY' ? '⚪ Sunday Rest' : '🔴 Absent'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.calcSummaryBox}>
                <Text style={styles.calcSummaryLabel}>NET CALCULATED PAY FOR RANGE</Text>
                <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
                <Text style={styles.calcSummarySub}>
                  Attended: {totalAttendedDays} of {totalScheduledDays} Paid Work Days
                </Text>
              </View>

              <TouchableOpacity style={styles.addExpenseBtn} onPress={() => setShowAttendanceModal(false)} activeOpacity={0.85}>
                <Text style={styles.addExpenseBtnText}>✓ Save & Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal visible={!!editItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, theme.card]}>
            <View style={styles.modalDragHandle} />
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalHeading, theme.text]}>Edit Record Details</Text>
              <TouchableOpacity onPress={() => setEditItem(null)} activeOpacity={0.6}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldTitle, theme.subtext]}>Date</Text>
            <input
              type="date"
              className={dateInputClassName}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <Text style={[styles.fieldTitle, theme.subtext]}>Expense Name</Text>
            <TextInput
              style={[styles.textInputFull, theme.btnBg, theme.text]}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={[styles.fieldTitle, theme.subtext]}>Amount (₱)</Text>
            <TextInput
              style={[styles.textInputFull, theme.btnBg, theme.text]}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={[styles.exportBtn, theme.btnBg]} onPress={() => setEditItem(null)} activeOpacity={0.7}>
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addExpenseBtn} onPress={handleSaveEdit} activeOpacity={0.85}>
                <Text style={styles.addExpenseBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  mainSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  themePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  themeEmoji: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  calcTriggerBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  calcTriggerBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  cardHeaderFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateNavBtn: {
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  todayPill: {
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginTop: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  todayPillText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Primary Balance Inner Card */
  mainBalanceCardInner: {
    borderRadius: 18,
    padding: 18,
    gap: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  innerCardSuccess: {
    backgroundColor: '#059669',
  },
  innerCardWarning: {
    backgroundColor: '#d97706',
  },
  innerCardDanger: {
    backgroundColor: '#dc2626',
  },
  balanceTag: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1.2,
  },
  balanceBigNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  balanceMiniRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStat: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 10,
    borderRadius: 12,
  },
  miniStatEditable: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    padding: 10,
    borderRadius: 12,
  },
  miniLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
  },
  miniLabelEditable: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '800',
  },
  miniValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  editableSalaryInput: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
    padding: 0,
    width: '100%',
    outlineWidth: 0,
  },
  progressContainer: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
  },
  progressStatusBadge: {
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    color: '#ffffff',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 99,
    overflow: 'hidden',
  },

  /* Forms */
  formFieldGroup: {
    gap: 6,
  },
  fieldTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  textInputFull: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: '600',
    outlineWidth: 0,
    width: '100%',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridColumn: {
    flex: 1,
    gap: 6,
  },
  addExpenseBtn: {
    backgroundColor: '#3b82f6',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  addExpenseBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },

  /* Attendance styles */
  scheduleBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  scheduleBannerText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  attRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  attDateText: {
    fontSize: 14,
    fontWeight: '700',
  },
  attBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  attFull: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  attHalf: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  attAbsent: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  attBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  calcSummaryBox: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  calcSummaryLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1.2,
  },
  calcSummaryVal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  calcSummarySub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },

  /* Expense List */
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBoxTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  emptyBoxText: {
    fontSize: 13,
    fontWeight: '500',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  expenseRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 140,
  },
  expenseIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: {
    fontSize: 20,
  },
  expenseTextInfo: {
    flex: 1,
  },
  expNameText: {
    fontSize: 15,
    fontWeight: '700',
  },
  expDateText: {
    fontSize: 12,
    marginTop: 2,
  },
  expenseRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expAmountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ef4444',
    marginRight: 4,
  },
  iconAction: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  footerBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  exportBtnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  exportBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
  pageFooterText: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 12,
  },

  /* Bottom sheet-like Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  modalDragHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#cbd5e1',
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseX: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  }
});

// Curated Sleek Colors
const darkTheme = {
  container: { backgroundColor: '#0b0f19' },
  card: { backgroundColor: '#161e2e', borderColor: '#242f41' },
  btnBg: { backgroundColor: '#0d131f', borderColor: '#242f41' },
  text: { color: '#f8fafc' },
  subtext: { color: '#94a3b8' },
};

const lightTheme = {
  container: { backgroundColor: '#f3f4f6' },
  card: { backgroundColor: '#ffffff', borderColor: '#e5e7eb' },
  btnBg: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
  text: { color: '#111827' },
  subtext: { color: '#6b7280' },
};
