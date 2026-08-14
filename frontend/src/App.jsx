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
  
  // Date Range Selection State
  const [cutoffStart, setCutoffStart] = useState('2026-07-11');
  const [cutoffEnd, setCutoffEnd] = useState('2026-07-25');
  
  // Selected Single Date within or outside range
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Cut-off Calculator Base Pay
  const [cutoffBasePay, setCutoffBasePay] = useState('10500'); // ₱10,500 per cut-off
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

  // --- AUTOMATIC SALARY CALCULATION FOR CUT-OFF DATE RANGE ---
  const rangeDates = getDateRangeArray(cutoffStart, cutoffEnd);
  const baseCutoffPay = parseFloat(cutoffBasePay) || 10500;

  let totalScheduledDays = 0;
  let totalAttendedDays = 0;

  rangeDates.forEach(d => {
    const status = getResolvedStatus(d);
    if (!isSunday(d)) totalScheduledDays += 1.0;
    if (status === 'FULL' || status === 'SAT_FULL') totalAttendedDays += 1.0;
    else if (status === 'HALF') totalAttendedDays += 0.5;
    else if (status === 'ABSENT' || status === 'REST_DAY') totalAttendedDays += 0;
  });

  const dailyCutoffRate = totalScheduledDays > 0 ? baseCutoffPay / totalScheduledDays : 0;
  const calculatedCutoffSalary = Math.round(totalAttendedDays * dailyCutoffRate * 100) / 100;

  // Active Salary for selected single date
  const currentDateSalary = dailySalaries[selectedDate] ?? calculatedCutoffSalary;

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

    // Clear custom overrides for dates in range so they calculate live
    const newDailySalaries = { ...dailySalaries };
    rangeDates.forEach(d => delete newDailySalaries[d]);

    setDailySalaries(newDailySalaries);
    saveData(newDailySalaries, expenses, isDark, newAttMap);
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

  // Modern input styles with smooth styling attributes
  const dateInputStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'inherit',
    outline: 'none',
    height: '48px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Modern Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.mainTitle, theme.text]}>💰 Budget Tracker</Text>
            <Text style={[styles.mainSubtitle, theme.subtext]}>Cut-off & Daily Salary Auto-Calculator</Text>
          </View>
          <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme} activeOpacity={0.7}>
            <Text style={styles.themeEmoji}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </TouchableOpacity>
        </View>

        {/* 📅 SELECT CUT-OFF DATE RANGE CARD */}
        <View style={[styles.cardContainer, theme.card]}>
          <View style={styles.cardHeaderFlexRow}>
            <Text style={[styles.sectionLabel, theme.subtext]}>📅 SELECT CUT-OFF DATE RANGE</Text>
            <TouchableOpacity style={styles.calcTriggerBtn} onPress={() => setShowAttendanceModal(true)} activeOpacity={0.85}>
              <Text style={styles.calcTriggerBtnText}>📋 Edit Attendance</Text>
            </TouchableOpacity>
          </View>

          {/* From & To Compact Inputs side-by-side */}
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridColumn}>
              <Text style={[styles.fieldTitle, theme.subtext]}>Start Date</Text>
              <input
                type="date"
                style={dateInputStyle}
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
                style={dateInputStyle}
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
            <Text style={styles.calcSummaryLabel}>AUTO-CALCULATED CUT-OFF PAY</Text>
            <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
            <Text style={styles.calcSummarySub}>
              Attended {totalAttendedDays} of {totalScheduledDays} Work Days (Base: ₱{cutoffBasePay})
            </Text>
          </View>
        </View>

        {/* View Record Date Selector */}
        <View style={[styles.cardContainer, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>🔍 VIEW SPECIFIC RECORD DATE</Text>
          <View style={styles.dateControlRow}>
            <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(-1)} activeOpacity={0.7}>
              <Text style={[styles.dateNavBtnText, theme.text]}>◀ Prev</Text>
            </TouchableOpacity>

            <View style={{ flex: 2 }}>
              <input
                type="date"
                style={dateInputStyle}
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
        </View>

        {/* Primary Remaining Balance Highlight Card */}
        <View style={[
          styles.mainBalanceCard,
          remainingForDate < 0 || spentPctForDate > 90 ? styles.cardDanger :
          spentPctForDate >= 75 ? styles.cardWarning : styles.cardSuccess
        ]}>
          <Text style={styles.balanceTag}>REMAINING BUDGET FOR {selectedDate}</Text>
          <Text style={styles.balanceBigNumber}>{formatPeso(remainingForDate)}</Text>

          <View style={styles.balanceMiniRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Assigned Salary</Text>
              <Text style={styles.miniValue}>{formatPeso(currentDateSalary)}</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Spent Today</Text>
              <Text style={styles.miniValue}>{formatPeso(totalDateExpenses)}</Text>
            </View>
          </View>

          {/* Simple Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Spent Ratio ({spentPctForDate}%)</Text>
              <Text style={styles.progressStatusBadge}>
                {remainingForDate < 0 || spentPctForDate > 90 ? '🔴 Critical' : spentPctForDate >= 75 ? '🟡 Caution' : '🟢 Healthy'}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${Math.min(spentPctForDate, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Add Expense Form */}
        <View style={[styles.cardContainer, theme.card]}>
          <View style={styles.cardHeaderFlexRow}>
            <Text style={[styles.sectionLabel, theme.subtext]}>✍️ ADD NEW EXPENSE</Text>
            <View style={styles.inlineDateWrapper}>
              <Text style={[styles.inlineDateLabel, theme.subtext]}>For Date:</Text>
              <input
                type="date"
                style={[dateInputStyle, { height: '36px', width: '140px', padding: '4px 8px', fontSize: '13px' }]}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </View>
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

        {/* Expenses List Card */}
        <View style={[styles.cardContainer, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>📋 EXPENSE RECORDS FOR {selectedDate}</Text>

          {dateExpenses.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: '32px', marginBottom: '8px' }}>🍂</Text>
              <Text style={[styles.emptyBoxText, theme.subtext]}>No expenses logged for {selectedDate}</Text>
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
                  <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconAction} activeOpacity={0.6}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconAction} activeOpacity={0.6}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={styles.footerBtnRow}>
            <TouchableOpacity style={[styles.exportBtn, theme.btnBg]} onPress={handleExportCSV} activeOpacity={0.7}>
              <Text style={[styles.exportBtnText, theme.text]}>📄 Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll} activeOpacity={0.7}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.pageFooterText, theme.subtext]}>Budget Tracker Pro &bull; Fully Responsive Mobile Design</Text>

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
                  💵 Cut-off Schedule Settings:{"\n"}
                  Saturdays = Halfday (Full Pay 1.0x) | Sundays = Rest Day (0x)
                </Text>
              </View>

              {/* Base Pay Input */}
              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Base Cut-off Salary (₱)</Text>
                <TextInput
                  style={[styles.textInputFull, theme.btnBg, theme.text]}
                  value={cutoffBasePay}
                  onChangeText={(val) => {
                    setCutoffBasePay(val);
                    saveData(dailySalaries, expenses, isDark, attendanceMap, { cutoffBasePay: val });
                  }}
                  keyboardType="numeric"
                  placeholder="10500"
                />
              </View>

              <Text style={[styles.fieldTitle, theme.subtext, { marginTop: 4 }]}>
                Daily Cut-off attendance details (Tap row to toggle state)
              </Text>

              <View style={styles.attList}>
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
                          {status === 'SAT_FULL' ? '🟢 Sat (Halfday - Full Pay 1.0x)' :
                           status === 'FULL' ? '🟢 Full Day (1.0x)' :
                           status === 'HALF' ? '🟡 Half Day (0.5x)' :
                           status === 'REST_DAY' ? '⚪ Sunday Rest Day (0x)' : '🔴 Absent (0x)'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.calcSummaryBox}>
                <Text style={styles.calcSummaryLabel}>NET CUT-OFF SALARY</Text>
                <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
                <Text style={styles.calcSummarySub}>
                  Attended: {totalAttendedDays} of {totalScheduledDays} Work Days
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
              style={dateInputStyle}
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
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
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
  inlineDateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineDateLabel: {
    fontSize: 13,
    fontWeight: '700',
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

  /* Primary Gradient Balance Card */
  mainBalanceCard: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  cardSuccess: {
    backgroundColor: '#059669',
  },
  cardWarning: {
    backgroundColor: '#d97706',
  },
  cardDanger: {
    backgroundColor: '#dc2626',
  },
  balanceTag: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1.2,
  },
  balanceBigNumber: {
    fontSize: 38,
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
    padding: 12,
    borderRadius: 14,
  },
  miniLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
  },
  miniValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
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
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 99,
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
    outlineStyle: 'none',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
  attList: {
    gap: 8,
    maxHeight: 280,
    overflowY: 'auto',
    paddingRight: 4,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  emptyBoxText: {
    fontSize: 14,
    fontWeight: '600',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
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
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 8,
  },
  footerBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  exportBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtnText: {
    fontSize: 14,
    fontWeight: '700',
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
