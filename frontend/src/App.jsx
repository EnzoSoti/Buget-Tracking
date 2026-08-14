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

  // Active Salary for selected single date (falls back to range calculated salary)
  const currentDateSalary = dailySalaries[selectedDate] ?? calculatedCutoffSalary;

  // Change Range Presets
  const setPresetRange = (startStr, endStr) => {
    setCutoffStart(startStr);
    setCutoffEnd(endStr);
    setSelectedDate(startStr);
    setExpenseDate(startStr);
    saveData(dailySalaries, expenses, isDark, attendanceMap, { cutoffStart: startStr, cutoffEnd: endStr });
  };

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

  // Save manual income override
  const handleUpdateSalary = (valStr) => {
    const val = parseFloat(valStr);
    const validVal = (!isNaN(val) && val >= 0) ? val : 0;
    
    const updatedSalaries = {
      ...dailySalaries,
      [selectedDate]: validVal
    };

    setDailySalaries(updatedSalaries);
    saveData(updatedSalaries, expenses, isDark);
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
  
  // Cut-off total expenses within the date range
  const cutoffExpenses = expenses.filter(exp => rangeDates.includes(exp.date));
  const totalCutoffExpenses = cutoffExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Remaining Balance for Selected Single Date & Entire Cut-off
  const remainingForDate = currentDateSalary - totalDateExpenses;
  const remainingForCutoff = calculatedCutoffSalary - totalCutoffExpenses;
  const spentPctForDate = currentDateSalary > 0 ? Math.min(Math.round((totalDateExpenses / currentDateSalary) * 100), 999) : 0;

  const theme = isDark ? darkTheme : lightTheme;

  const rangeDateInputStyle = {
    flex: '1 1 120px',
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '40px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    width: '100%'
  };

  const compactDateInputStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '38px',
    maxWidth: '180px',
    boxSizing: 'border-box',
    cursor: 'pointer'
  };

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.mainTitle, theme.text]}>Budget Tracker</Text>
            <Text style={[styles.mainSubtitle, theme.subtext]}>Cut-off Date Range Salary Auto-Calculator</Text>
          </View>
          <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme}>
            <Text style={styles.themeEmoji}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </TouchableOpacity>
        </View>

        {/* 📅 SELECT CUT-OFF DATE RANGE CARD */}
        <View style={[styles.simpleCard, theme.card]}>
          <View style={styles.cardHeaderFlexRow}>
            <Text style={[styles.sectionLabel, theme.subtext]}>SELECT CUT-OFF DATE RANGE</Text>
            <TouchableOpacity style={styles.calcTriggerBtn} onPress={() => setShowAttendanceModal(true)}>
              <Text style={styles.calcTriggerBtnText}>📋 Edit Attendance</Text>
            </TouchableOpacity>
          </View>

          {/* From & To Date Pickers */}
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridColumn}>
              <Text style={[styles.fieldTitle, theme.subtext]}>From (Start Date)</Text>
              <input
                type="date"
                style={rangeDateInputStyle}
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
              <Text style={[styles.fieldTitle, theme.subtext]}>To (End Date)</Text>
              <input
                type="date"
                style={rangeDateInputStyle}
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

          {/* Quick Cut-off Range Presets */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScrollView}>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => setPresetRange('2026-07-11', '2026-07-25')}>
              <Text style={theme.text}>📅 July 11 – 25</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => setPresetRange('2026-07-26', '2026-08-10')}>
              <Text style={theme.text}>📅 July 26 – Aug 10</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => setPresetRange('2026-08-11', '2026-08-25')}>
              <Text style={theme.text}>📅 Aug 11 – 25</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => setPresetRange('2026-08-26', '2026-09-10')}>
              <Text style={theme.text}>📅 Aug 26 – Sep 10</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Computed Salary Banner */}
          <View style={styles.calcSummaryBox}>
            <Text style={styles.calcSummaryLabel}>AUTO-CALCULATED SALARY FOR {cutoffStart} TO {cutoffEnd}</Text>
            <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
            <Text style={styles.calcSummarySub}>
              Attended: {totalAttendedDays} of {totalScheduledDays} Work Days (Base: ₱{cutoffBasePay})
            </Text>
          </View>
        </View>

        {/* Date Filter Row for Expenses */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>VIEW RECORD DATE</Text>
          <View style={styles.dateControlRow}>
            <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(-1)}>
              <Text style={[styles.dateNavBtnText, theme.text]}>◀ Prev</Text>
            </TouchableOpacity>

            <input
              type="date"
              style={rangeDateInputStyle}
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setExpenseDate(e.target.value);
                }
              }}
            />

            <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(1)}>
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
          <Text style={styles.balanceTag}>REMAINING BALANCE ({selectedDate})</Text>
          <Text style={styles.balanceBigNumber}>{formatPeso(remainingForDate)}</Text>

          <View style={styles.balanceMiniRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Cut-off Salary</Text>
              <Text style={styles.miniValue}>{formatPeso(currentDateSalary)}</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Spent on {selectedDate}</Text>
              <Text style={styles.miniValue}>{formatPeso(totalDateExpenses)}</Text>
            </View>
          </View>

          {/* Simple Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Spent Ratio ({spentPctForDate}%)</Text>
              <Text style={styles.progressLabel}>
                {remainingForDate < 0 || spentPctForDate > 90 ? 'Critical' : spentPctForDate >= 75 ? 'Caution' : 'Healthy'}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${Math.min(spentPctForDate, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Add Expense Form */}
        <View style={[styles.simpleCard, theme.card]}>
          <View style={styles.cardHeaderFlexRow}>
            <Text style={[styles.sectionLabel, theme.subtext]}>ADD NEW EXPENSE</Text>
            
            <View style={styles.inlineDateWrapper}>
              <Text style={[styles.inlineDateLabel, theme.subtext]}>Date:</Text>
              <input
                type="date"
                style={compactDateInputStyle}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </View>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={[styles.fieldTitle, theme.subtext]}>Expense Name</Text>
            <TextInput
              style={[styles.textInputFull, theme.btnBg, theme.text]}
              placeholder="e.g. Rice, Electric Bill..."
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

          <TouchableOpacity style={styles.addExpenseBtn} onPress={handleAddExpense}>
            <Text style={styles.addExpenseBtnText}>+ Add Expense ({expenseDate})</Text>
          </TouchableOpacity>
        </View>

        {/* Expenses List Card */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>RECORDS FOR {selectedDate}</Text>

          {dateExpenses.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyBoxText, theme.subtext]}>No expenses for {selectedDate}</Text>
            </View>
          ) : (
            dateExpenses.map(item => (
              <View key={item.id} style={[styles.expenseRow, theme.btnBg]}>
                <View style={styles.expenseRowLeft}>
                  <Text style={styles.catEmoji}>💸</Text>
                  <View style={styles.expenseTextInfo}>
                    <Text style={[styles.expNameText, theme.text]}>{item.name}</Text>
                    <Text style={[styles.expDateText, theme.subtext]}>📅 {item.date}</Text>
                  </View>
                </View>

                <View style={styles.expenseRowRight}>
                  <Text style={styles.expAmountText}>-{formatPeso(item.amount)}</Text>
                  <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconAction}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconAction}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={styles.footerBtnRow}>
            <TouchableOpacity style={[styles.exportBtn, theme.btnBg]} onPress={handleExportCSV}>
              <Text style={[styles.exportBtnText, theme.text]}>📄 Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.pageFooterText, theme.subtext]}>Salary Budget Tracker &bull; Cut-off Range Calculator</Text>

      </ScrollView>

      {/* Attendance & Salary Details Modal */}
      <Modal visible={showAttendanceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, theme.card, { maxHeight: '90%' }]}>
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalHeading, theme.text]}>📋 Cut-off Attendance Sheet</Text>
              <TouchableOpacity onPress={() => setShowAttendanceModal(false)}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12 }}>
              <View style={[styles.scheduleBanner, theme.btnBg]}>
                <Text style={[styles.scheduleBannerText, theme.text]}>
                  💵 Range: {cutoffStart} to {cutoffEnd}{"\n"}
                  📅 Saturdays = Halfday (Full Pay 1.0x) | Sundays = Rest Day (0x)
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

              <Text style={[styles.fieldTitle, theme.subtext]}>
                Daily Attendance (Tap row to toggle Full/Halfday/Absent)
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

              <TouchableOpacity style={styles.addExpenseBtn} onPress={() => setShowAttendanceModal(false)}>
                <Text style={styles.addExpenseBtnText}>✓ Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal visible={!!editItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, theme.card]}>
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalHeading, theme.text]}>Edit Record</Text>
              <TouchableOpacity onPress={() => setEditItem(null)}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldTitle, theme.subtext]}>Date</Text>
            <input
              type="date"
              style={compactDateInputStyle}
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
              <TouchableOpacity style={[styles.exportBtn, theme.btnBg]} onPress={() => setEditItem(null)}>
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addExpenseBtn} onPress={handleSaveEdit}>
                <Text style={styles.addExpenseBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Clean Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    gap: 12,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeEmoji: {
    fontSize: 12,
    fontWeight: '700',
  },
  simpleCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  presetsScrollView: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  calcTriggerBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  calcTriggerBtnText: {
    color: '#ffffff',
    fontSize: 11,
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
    gap: 6,
  },
  inlineDateLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  dateNavBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  todayPill: {
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  todayPillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Primary Balance Card */
  mainBalanceCard: {
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  cardSuccess: {
    backgroundColor: '#065f46',
  },
  cardWarning: {
    backgroundColor: '#92400e',
  },
  cardDanger: {
    backgroundColor: '#991b1b',
  },
  balanceTag: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 1,
  },
  balanceBigNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  balanceMiniRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  miniStat: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  miniLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '700',
  },
  miniValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 4,
    gap: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    gap: 4,
  },
  fieldTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  textInputFull: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 14,
    outlineStyle: 'none',
    width: '100%',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  gridColumn: {
    flex: 1,
    minWidth: 130,
    gap: 4,
  },
  addExpenseBtn: {
    backgroundColor: '#3b82f6',
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  addExpenseBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },

  /* Attendance Calculator Styles */
  scheduleBanner: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  scheduleBannerText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoBoxVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  attList: {
    gap: 6,
    maxHeight: 240,
    overflowY: 'auto',
  },
  attRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    flexWrap: 'wrap',
  },
  attDateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  attBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
  },
  calcSummaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1,
  },
  calcSummaryVal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
  },
  calcSummarySub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },

  /* Expense List */
  emptyBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyBoxText: {
    fontSize: 14,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    flexWrap: 'wrap',
  },
  expenseRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 140,
  },
  catEmoji: {
    fontSize: 22,
  },
  expenseTextInfo: {
    flex: 1,
  },
  expNameText: {
    fontSize: 14,
    fontWeight: '800',
  },
  expDateText: {
    fontSize: 11,
  },
  expenseRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expAmountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
  },
  iconAction: {
    padding: 4,
  },
  footerBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  exportBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  pageFooterText: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 8,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalCloseX: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  }
});

// Themes
const darkTheme = {
  container: { backgroundColor: '#0f172a' },
  card: { backgroundColor: '#1e293b', borderColor: '#334155' },
  btnBg: { backgroundColor: '#0f172a', borderColor: '#334155' },
  text: { color: '#f8fafc' },
  subtext: { color: '#94a3b8' },
};

const lightTheme = {
  container: { backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  btnBg: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  text: { color: '#0f172a' },
  subtext: { color: '#64748b' },
};
