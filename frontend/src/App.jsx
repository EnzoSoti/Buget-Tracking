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

// Professional Vector SVG Icon Components
const SvgIcon = ({ size = 20, color = "#94a3b8", children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

const WalletIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </SvgIcon>
);

const BriefcaseIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </SvgIcon>
);

const PlusIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </SvgIcon>
);

const ChartIcon = (props) => (
  <SvgIcon {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </SvgIcon>
);

const ReceiptIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="14" y2="14" />
  </SvgIcon>
);

const CalendarIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </SvgIcon>
);

const SunIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </SvgIcon>
);

const MoonIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </SvgIcon>
);

const EditIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </SvgIcon>
);

const TrashIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </SvgIcon>
);

const DownloadIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </SvgIcon>
);

const ChevronLeftIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="15 18 9 12 15 6" />
  </SvgIcon>
);

const ChevronRightIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </SvgIcon>
);

const EmptyIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </SvgIcon>
);

const CheckIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </SvgIcon>
);

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
  
  // Customizable Monthly Net Salary (Default ₱21,000 for any user to customize)
  const [monthlySalary, setMonthlySalary] = useState('21000');
  
  // Customizable Default Daily Income for Daily Budget Calculator
  const [defaultDailyIncome, setDefaultDailyIncome] = useState('700');
  
  // Date Range Selection State for Cut-off Salary Calculator
  const [cutoffStart, setCutoffStart] = useState('2026-07-26');
  const [cutoffEnd, setCutoffEnd] = useState('2026-08-10');
  
  // Selected Single Date within or outside range
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Cut-off Base Pay setup (Defaults to monthlySalary / 2)
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
        if (parsed.monthlySalary) setMonthlySalary(parsed.monthlySalary);
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
        monthlySalary,
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

  // Handler to update Monthly Net Salary and auto-update Cut-off Base Pay (Monthly Net / 2)
  const handleMonthlySalaryChange = (val) => {
    setMonthlySalary(val);
    const parsedMonthly = parseFloat(val);
    const newCutoffBase = !isNaN(parsedMonthly) && parsedMonthly > 0 ? (parsedMonthly / 2).toString() : '10500';
    setCutoffBasePay(newCutoffBase);
    saveData(dailySalaries, expenses, isDark, attendanceMap, { monthlySalary: val, cutoffBasePay: newCutoffBase });
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

  // --- DYNAMIC CUT-OFF SALARY CALCULATOR (SCALES DYNAMICALLY WITH DATE RANGE) ---
  const rangeDates = getDateRangeArray(cutoffStart, cutoffEnd);
  
  let calculatedCutoffSalary = 0;
  let totalScheduledDays = 0;
  let totalAttendedDays = 0;

  const userMonthly = parseFloat(monthlySalary) || 21000;
  // Standard daily rate for workdays based on 26 workdays per month
  const dailyWorkRate = userMonthly / 26;

  rangeDates.forEach(d => {
    const status = getResolvedStatus(d);

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

    calculatedCutoffSalary += dailyWorkRate * multiplier;
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

  // Add Expense with guaranteed unique ID
  const handleAddExpense = () => {
    const amt = parseFloat(amount);
    if (!name.trim() || isNaN(amt) || amt <= 0) return;

    const newItem = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9),
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

  // Delete Single Expense (only removes this specific item by unique ID)
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

  // Clear Expenses ONLY for the currently selected date (keeps expenses on all other dates!)
  const handleClearSelectedDateExpenses = () => {
    const targetDateExpenses = expenses.filter(exp => exp.date === selectedDate);
    if (targetDateExpenses.length === 0) return;
    
    if (confirm(`Delete all ${targetDateExpenses.length} expense(s) logged for ${selectedDate}?`)) {
      const updated = expenses.filter(exp => exp.date !== selectedDate);
      setExpenses(updated);
      saveData(dailySalaries, updated, isDark);
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
  const iconColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedIconColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Modern Header */}
        <View style={styles.topHeader}>
          <View style={styles.titleRowFlex}>
            <WalletIcon size={28} color="#3b82f6" />
            <View>
              <Text style={[styles.mainTitle, theme.text]}>Budget Tracker</Text>
              <Text style={[styles.mainSubtitle, theme.subtext]}>Universal Salary & Expense Calculator</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme} activeOpacity={0.7}>
            {isDark ? <SunIcon size={18} color="#f59e0b" /> : <MoonIcon size={18} color="#3b82f6" />}
          </TouchableOpacity>
        </View>

        {/* HTML div grid wrapper for reliable sideways desktop columns & clear card separation */}
        <div className="responsive-row">
          
          {/* COLUMN 1 */}
          <div className="responsive-col">
            
            {/* FEATURE 1: CUT-OFF SALARY CALCULATOR CARD WITH CUSTOMIZABLE MONTHLY SALARY */}
            <View style={[styles.cardContainer, theme.card]}>
              <View style={styles.cardHeaderFlexRow}>
                <View style={styles.headerTitleGroup}>
                  <BriefcaseIcon size={20} color="#3b82f6" />
                  <Text style={[styles.sectionLabel, theme.text]}>Cut-off Salary Calculator</Text>
                </View>
                <TouchableOpacity style={styles.calcTriggerBtn} onPress={() => setShowAttendanceModal(true)} activeOpacity={0.85}>
                  <CalendarIcon size={15} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.calcTriggerBtnText}>Attendance</Text>
                </TouchableOpacity>
              </View>

              {/* Customizable Monthly Net Salary Input */}
              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Monthly Net Salary (₱)</Text>
                <TextInput
                  style={[styles.textInputFull, theme.btnBg, theme.text]}
                  value={monthlySalary}
                  onChangeText={handleMonthlySalaryChange}
                  keyboardType="numeric"
                  placeholder="e.g. 21000, 30000, 50000..."
                />
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
                <Text style={styles.calcSummaryLabel}>AUTO-CALCULATED CUT-OFF PAY</Text>
                <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
                <Text style={styles.calcSummarySub}>
                  Base: {formatPeso(userMonthly / 2)} (₱{userMonthly}/mo) • {totalAttendedDays} of {totalScheduledDays} Work Days
                </Text>
              </View>
            </View>

            {/* ADD EXPENSE FORM */}
            <View style={[styles.cardContainer, theme.card]}>
              <View style={styles.cardHeaderFlexRow}>
                <View style={styles.headerTitleGroup}>
                  <PlusIcon size={20} color="#3b82f6" />
                  <Text style={[styles.sectionLabel, theme.text]}>Add New Expense</Text>
                </View>
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
                <Text style={styles.addExpenseBtnText}>+ Add Expense for {expenseDate}</Text>
              </TouchableOpacity>
            </View>

          </div>

          {/* COLUMN 2 */}
          <div className="responsive-col">
            
            {/* FEATURE 2: DAILY EXPENSE CALCULATOR */}
            <View style={[styles.cardContainer, theme.card]}>
              <View style={styles.headerTitleGroup}>
                <ChartIcon size={20} color="#3b82f6" />
                <Text style={[styles.sectionLabel, theme.text]}>Daily Budget Calculator</Text>
              </View>
              
              {/* Selected Date navigation inside the calculator */}
              <View style={styles.dateControlRow}>
                <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(-1)} activeOpacity={0.7}>
                  <ChevronLeftIcon size={18} color={iconColor} />
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
                  <ChevronRightIcon size={18} color={iconColor} />
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
                  {/* EDITABLE DAILY INCOME AMOUNT WITH PROFESSIONAL ICON */}
                  <View style={styles.miniStatEditable}>
                    <View style={styles.miniLabelFlexRow}>
                      <Text style={styles.miniLabelEditable}>Daily Income (₱)</Text>
                      <EditIcon size={12} color="#ffffff" />
                    </View>
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
                      {remainingForDate < 0 || spentPctForDate > 90 ? 'Critical' : spentPctForDate >= 75 ? 'Caution' : 'Healthy'}
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
              <View style={styles.headerTitleGroup}>
                <ReceiptIcon size={20} color="#3b82f6" />
                <Text style={[styles.sectionLabel, theme.text]}>Expenses for {selectedDate}</Text>
              </View>

              {dateExpenses.length === 0 ? (
                <View style={styles.emptyBox}>
                  <EmptyIcon size={38} color={mutedIconColor} style={{ marginBottom: 8 }} />
                  <Text style={[styles.emptyBoxTitle, theme.text]}>No Expenses Logged</Text>
                  <Text style={[styles.emptyBoxText, theme.subtext]}>Tap "+ Add Expense" to log your daily purchases.</Text>
                </View>
              ) : (
                dateExpenses.map(item => (
                  <View key={item.id} style={[styles.expenseRow, theme.btnBg]}>
                    <View style={styles.expenseRowLeft}>
                      <View style={styles.expenseIconWrapper}>
                        <ReceiptIcon size={18} color="#ef4444" />
                      </View>
                      <View style={styles.expenseTextInfo}>
                        <Text style={[styles.expNameText, theme.text]}>{item.name}</Text>
                        <Text style={[styles.expDateText, theme.subtext]}>{item.date}</Text>
                      </View>
                    </View>

                    <View style={styles.expenseRowRight}>
                      <Text style={styles.expAmountText}>-{formatPeso(item.amount)}</Text>
                      <TouchableOpacity onPress={() => openEdit(item)} style={[styles.iconAction, theme.btnBg]} activeOpacity={0.6}>
                        <EditIcon size={15} color={iconColor} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.iconAction, theme.btnBg]} activeOpacity={0.6}>
                        <TrashIcon size={15} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}

              <View style={styles.footerBtnRow}>
                <TouchableOpacity style={styles.exportBtnPrimary} onPress={handleExportCSV} activeOpacity={0.8}>
                  <DownloadIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.exportBtnPrimaryText}>Export CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClearSelectedDateExpenses} activeOpacity={0.7}>
                  <TrashIcon size={16} color="#ef4444" style={{ marginRight: 6 }} />
                  <Text style={styles.clearBtnText}>Clear Date</Text>
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
              <Text style={[styles.modalHeading, theme.text]}>Cut-off Attendance Sheet</Text>
              <TouchableOpacity onPress={() => setShowAttendanceModal(false)} activeOpacity={0.6}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 14 }} showsVerticalScrollIndicator={false}>
              <View style={[styles.scheduleBanner, theme.btnBg]}>
                <Text style={[styles.scheduleBannerText, theme.text]}>
                  Semi-Monthly Cut-off Settings:{"\n"}
                  Monthly Net: {formatPeso(parseFloat(monthlySalary) || 21000)} | Semi-Monthly Base: {formatPeso(userMonthly / 2)}{"\n"}
                  Saturdays = Halfday (Full Pay 1.0x) | Sundays = Rest Day (0x)
                </Text>
              </View>

              {/* Monthly Net Salary Input in Modal */}
              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Monthly Net Salary (₱)</Text>
                <TextInput
                  style={[styles.textInputFull, theme.btnBg, theme.text]}
                  value={monthlySalary}
                  onChangeText={handleMonthlySalaryChange}
                  keyboardType="numeric"
                  placeholder="21000"
                />
              </View>

              {/* Base Cut-off Pay Input */}
              <View style={styles.formFieldGroup}>
                <Text style={[styles.fieldTitle, theme.subtext]}>Semi-Monthly Cut-off Pay (₱)</Text>
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
                        {dateStr} ({dayName})
                      </Text>
                      
                      <View style={[
                        styles.attBadge,
                        status === 'FULL' || status === 'SAT_FULL' ? styles.attFull :
                        status === 'HALF' ? styles.attHalf : styles.attAbsent
                      ]}>
                        <Text style={styles.attBadgeText}>
                          {status === 'SAT_FULL' ? 'Sat (Full Pay)' :
                           status === 'FULL' ? 'Full Day' :
                           status === 'HALF' ? 'Half Day' :
                           status === 'REST_DAY' ? 'Sunday Rest' : 'Absent'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.calcSummaryBox}>
                <Text style={styles.calcSummaryLabel}>NET CALCULATED CUT-OFF PAY</Text>
                <Text style={styles.calcSummaryVal}>{formatPeso(calculatedCutoffSalary)}</Text>
                <Text style={styles.calcSummarySub}>
                  Attended: {totalAttendedDays} of {totalScheduledDays} Paid Work Days
                </Text>
              </View>

              <TouchableOpacity style={styles.addExpenseBtn} onPress={() => setShowAttendanceModal(false)} activeOpacity={0.85}>
                <CheckIcon size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.addExpenseBtnText}>Save & Close</Text>
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
  titleRowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  themePill: {
    width: 40,
    height: 40,
    borderRadius: 99,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  calcTriggerBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  miniLabelFlexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
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
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
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
    flexDirection: 'row',
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
