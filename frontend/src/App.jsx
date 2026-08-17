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

// Professional Vector SVG Icon Components (Lucide / Linear FinTech style)
const SvgIcon = ({ size = 18, color = "#94a3b8", children, style }) => (
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

const ClockIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
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

const SlidersIcon = (props) => (
  <SvgIcon {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
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
  
  // Active Tab for Segmented Control Navigation: 'ALL' | 'DAILY' | 'SALARY' | 'EXPENSES'
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Customizable Monthly Net Salary (Default ₱21,000)
  const [monthlySalary, setMonthlySalary] = useState('21000');
  
  // Customizable Default Daily Income for Daily Budget Calculator
  const [defaultDailyIncome, setDefaultDailyIncome] = useState('700');
  
  // Date Range Selection State for Cut-off Salary Calculator
  const [cutoffStart, setCutoffStart] = useState('2026-07-26');
  const [cutoffEnd, setCutoffEnd] = useState('2026-08-10');
  
  // Selected Single Date within or outside range
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Cut-off Base Pay setup
  const [cutoffBasePay, setCutoffBasePay] = useState('10500');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  
  // Map of Date -> Attendance Status ('FULL', 'SAT_FULL', 'HALF', 'ABSENT', 'REST_DAY')
  const [attendanceMap, setAttendanceMap] = useState({});
  
  // Map of Date -> Tardy Minutes (e.g. { '2026-08-17': 23 })
  const [tardyMap, setTardyMap] = useState({});
  
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
        if (parsed.tardyMap) {
          setTardyMap(parsed.tardyMap);
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
        tardyMap,
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

  // Handler to update Monthly Net Salary and auto-update Cut-off Base Pay
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

  // --- DYNAMIC CUT-OFF SALARY & TARDINESS CALCULATIONS ---
  const rangeDates = getDateRangeArray(cutoffStart, cutoffEnd);
  
  let grossCutoffSalary = 0;
  let totalScheduledDays = 0;
  let totalAttendedDays = 0;
  let totalTardyMinutes = 0;

  const userMonthly = parseFloat(monthlySalary) || 21000;
  // Standard daily rate for workdays based on 26 workdays per month
  const dailyWorkRate = userMonthly / 26;
  // Per-minute rate: dailyWorkRate / 480 (8 hours * 60 mins)
  const minuteRate = dailyWorkRate / 480;

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

    grossCutoffSalary += dailyWorkRate * multiplier;

    if (multiplier > 0 && tardyMap[d]) {
      const mins = parseFloat(tardyMap[d]) || 0;
      totalTardyMinutes += mins;
    }
  });

  const totalTardyDeduction = totalTardyMinutes * minuteRate;
  const netCalculatedCutoffSalary = Math.max(0, grossCutoffSalary - totalTardyDeduction);
  const calculatedCutoffSalary = Math.round(netCalculatedCutoffSalary * 100) / 100;

  // Active daily income for selected date
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

  // Delete Single Expense
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

  // Clear Expenses ONLY for currently selected date
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
  const dateInputClassName = isDark ? "modern-date-input" : "modern-date-input light-theme-picker";
  const iconColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedIconColor = isDark ? "#94a3b8" : "#64748b";

  // Tab Filtering Conditions
  const showSalaryCard = activeTab === 'ALL' || activeTab === 'SALARY';
  const showDailyCard = activeTab === 'ALL' || activeTab === 'DAILY';
  const showExpenseForm = activeTab === 'ALL' || activeTab === 'EXPENSES' || activeTab === 'DAILY';
  const showExpenseList = activeTab === 'ALL' || activeTab === 'EXPENSES' || activeTab === 'DAILY';

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Minimalist FinTech Top Navigation Bar */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogoBox}>
              <WalletIcon size={20} color="#10b981" />
            </View>
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={[styles.mainTitle, theme.text]}>Budget</Text>
                <Text style={[styles.mainTitleAccent]}>Pro</Text>
              </View>
              <Text style={[styles.mainSubtitle, theme.subtext]}>
                {formatPeso(parseFloat(monthlySalary) || 21000)} /mo Net
              </Text>
            </View>
          </View>

          <View style={styles.topRightControls}>
            <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme} activeOpacity={0.7}>
              {isDark ? <SunIcon size={16} color="#f59e0b" /> : <MoonIcon size={16} color="#10b981" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Linear FinTech Segmented Navigation Tabs */}
        <View style={[styles.segmentedTabBar, theme.segmentBg]}>
          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'ALL' && styles.segmentTabActive]}
            onPress={() => setActiveTab('ALL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'ALL' ? styles.segmentTabTextActive : theme.subtext]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'DAILY' && styles.segmentTabActive]}
            onPress={() => setActiveTab('DAILY')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'DAILY' ? styles.segmentTabTextActive : theme.subtext]}>
              Daily Budget
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'SALARY' && styles.segmentTabActive]}
            onPress={() => setActiveTab('SALARY')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'SALARY' ? styles.segmentTabTextActive : theme.subtext]}>
              Cut-off Pay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'EXPENSES' && styles.segmentTabActive]}
            onPress={() => setActiveTab('EXPENSES')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'EXPENSES' ? styles.segmentTabTextActive : theme.subtext]}>
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Responsive Grid Layout */}
        <div className="responsive-row">
          
          {/* COLUMN 1 */}
          <div className="responsive-col">
            
            {/* FEATURE 1: CUT-OFF SALARY CALCULATOR */}
            {showSalaryCard && (
              <View style={[styles.fintechCard, theme.card]}>
                <View style={styles.cardHeaderFlex}>
                  <View style={styles.headerIconGroup}>
                    <BriefcaseIcon size={17} color="#10b981" />
                    <Text style={[styles.cardTitle, theme.text]}>Cut-off Salary Calculator</Text>
                  </View>
                  <TouchableOpacity style={styles.attendanceBtn} onPress={() => setShowAttendanceModal(true)} activeOpacity={0.85}>
                    <CalendarIcon size={14} color="#ffffff" style={{ marginRight: 5 }} />
                    <Text style={styles.attendanceBtnText}>Attendance</Text>
                  </TouchableOpacity>
                </View>

                {/* Monthly Salary Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, theme.subtext]}>Monthly Net Salary (₱)</Text>
                  <TextInput
                    style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                    value={monthlySalary}
                    onChangeText={handleMonthlySalaryChange}
                    keyboardType="numeric"
                    placeholder="21000"
                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  />
                </View>

                {/* From & To Date Range Inputs */}
                <View style={styles.twoColumnGrid}>
                  <View style={styles.gridColumn}>
                    <Text style={[styles.inputLabel, theme.subtext]}>Start Date</Text>
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
                    <Text style={[styles.inputLabel, theme.subtext]}>End Date</Text>
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

                {/* FinTech Salary Result Banner */}
                <View style={[styles.salaryHeroBanner, theme.heroSalaryBg]}>
                  <View style={styles.heroBannerHeader}>
                    <Text style={styles.heroTag}>AUTO-CALCULATED CUT-OFF PAY</Text>
                    <View style={styles.workdaysPill}>
                      <Text style={styles.workdaysPillText}>
                        {totalAttendedDays}/{totalScheduledDays} Days
                      </Text>
                    </View>
                  </View>

                  <Text className="fintech-mono" style={styles.heroSalaryValue}>
                    {formatPeso(calculatedCutoffSalary)}
                  </Text>

                  <View style={styles.salaryBreakdownStrip}>
                    <Text style={styles.breakdownMuted}>
                      Gross: {formatPeso(grossCutoffSalary)}
                    </Text>
                    {totalTardyMinutes > 0 ? (
                      <Text style={styles.breakdownTardy}>
                        • Tardy: -{formatPeso(totalTardyDeduction)} ({totalTardyMinutes}m)
                      </Text>
                    ) : (
                      <Text style={styles.breakdownMuted}>
                        • Base: {formatPeso(userMonthly / 2)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* ADD EXPENSE FORM */}
            {showExpenseForm && (
              <View style={[styles.fintechCard, theme.card]}>
                <View style={styles.cardHeaderFlex}>
                  <View style={styles.headerIconGroup}>
                    <PlusIcon size={17} color="#10b981" />
                    <Text style={[styles.cardTitle, theme.text]}>Log New Expense</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, theme.subtext]}>Date</Text>
                  <input
                    type="date"
                    className={dateInputClassName}
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, theme.subtext]}>Expense Description</Text>
                  <TextInput
                    style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                    placeholder="e.g. Groceries, Meal, Internet..."
                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, theme.subtext]}>Amount (₱)</Text>
                  <TextInput
                    style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                <TouchableOpacity style={styles.primaryAddBtn} onPress={handleAddExpense} activeOpacity={0.85}>
                  <Text style={styles.primaryAddBtnText}>+ Add Expense to {expenseDate}</Text>
                </TouchableOpacity>
              </View>
            )}

          </div>

          {/* COLUMN 2 */}
          <div className="responsive-col">
            
            {/* FEATURE 2: DAILY BUDGET CALCULATOR */}
            {showDailyCard && (
              <View style={[styles.fintechCard, theme.card]}>
                <View style={styles.cardHeaderFlex}>
                  <View style={styles.headerIconGroup}>
                    <ChartIcon size={17} color="#10b981" />
                    <Text style={[styles.cardTitle, theme.text]}>Daily Budget Calculator</Text>
                  </View>
                </View>
                
                {/* Date Navigation Bar */}
                <View style={styles.dateNavWrapper}>
                  <TouchableOpacity style={[styles.dateNavArrow, theme.btnBg]} onPress={() => changeDateByDays(-1)} activeOpacity={0.7}>
                    <ChevronLeftIcon size={16} color={iconColor} />
                  </TouchableOpacity>

                  <View style={{ flex: 1 }}>
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

                  <TouchableOpacity style={[styles.dateNavArrow, theme.btnBg]} onPress={() => changeDateByDays(1)} activeOpacity={0.7}>
                    <ChevronRightIcon size={16} color={iconColor} />
                  </TouchableOpacity>
                </View>

                {selectedDate !== getTodayString() && (
                  <TouchableOpacity
                    style={styles.jumpTodayPill}
                    onPress={() => {
                      const today = getTodayString();
                      setSelectedDate(today);
                      setExpenseDate(today);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.jumpTodayText}>Jump to Today ({getTodayString()})</Text>
                  </TouchableOpacity>
                )}

                {/* Hero Balance Card */}
                <View style={[
                  styles.dailyBalanceHero,
                  remainingForDate < 0 || spentPctForDate > 90 ? styles.heroDanger :
                  spentPctForDate >= 75 ? styles.heroWarning : styles.heroHealthy
                ]}>
                  <View style={styles.heroTopRow}>
                    <Text style={styles.heroBalanceLabel}>REMAINING BUDGET FOR {selectedDate}</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>
                        {remainingForDate < 0 || spentPctForDate > 90 ? 'Critical' : spentPctForDate >= 75 ? 'Caution' : 'Healthy'}
                      </Text>
                    </View>
                  </View>

                  <Text className="fintech-mono" style={styles.heroBalanceNumber}>
                    {formatPeso(remainingForDate)}
                  </Text>

                  {/* Dual Stat Metrics */}
                  <View style={styles.dualStatRow}>
                    <View style={styles.miniMetricBox}>
                      <View style={styles.miniMetricHeader}>
                        <Text style={styles.miniMetricLabel}>Daily Income (₱)</Text>
                        <EditIcon size={11} color="#ffffff" />
                      </View>
                      <TextInput
                        className="fintech-mono"
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

                    <View style={styles.miniMetricBox}>
                      <Text style={styles.miniMetricLabel}>Spent Today</Text>
                      <Text className="fintech-mono" style={styles.miniMetricValue}>
                        {formatPeso(totalDateExpenses)}
                      </Text>
                    </View>
                  </View>

                  {/* Animated Progress Bar */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressLabelsRow}>
                      <Text style={styles.progressSubLabel}>Spent Ratio</Text>
                      <Text className="fintech-mono" style={styles.progressPctLabel}>{spentPctForDate}%</Text>
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
            )}

            {/* EXPENSE RECORDS LIST */}
            {showExpenseList && (
              <View style={[styles.fintechCard, theme.card]}>
                <View style={styles.cardHeaderFlex}>
                  <View style={styles.headerIconGroup}>
                    <ReceiptIcon size={17} color="#10b981" />
                    <Text style={[styles.cardTitle, theme.text]}>Expenses for {selectedDate}</Text>
                  </View>
                  {dateExpenses.length > 0 && (
                    <Text className="fintech-mono" style={[styles.expenseTotalHeader, theme.subtext]}>
                      -{formatPeso(totalDateExpenses)}
                    </Text>
                  )}
                </View>

                {dateExpenses.length === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <EmptyIcon size={32} color={mutedIconColor} style={{ marginBottom: 6 }} />
                    <Text style={[styles.emptyTitle, theme.text]}>No Expenses Logged</Text>
                    <Text style={[styles.emptySubtitle, theme.subtext]}>Tap "+ Add Expense" above to record purchases.</Text>
                  </View>
                ) : (
                  dateExpenses.map(item => (
                    <View key={item.id} style={[styles.expenseItemRow, theme.inputBg]}>
                      <View style={styles.expenseLeftCol}>
                        <View style={styles.expenseTagIconBox}>
                          <ReceiptIcon size={15} color="#f43f5e" />
                        </View>
                        <View style={styles.expenseDetails}>
                          <Text style={[styles.expName, theme.text]}>{item.name}</Text>
                          <Text style={[styles.expDate, theme.subtext]}>{item.date}</Text>
                        </View>
                      </View>

                      <View style={styles.expenseRightCol}>
                        <Text className="fintech-mono" style={styles.expAmount}>
                          -{formatPeso(item.amount)}
                        </Text>
                        <TouchableOpacity onPress={() => openEdit(item)} style={[styles.iconBtnAction, theme.btnBg]} activeOpacity={0.6}>
                          <EditIcon size={13} color={iconColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.iconBtnAction, theme.btnBg]} activeOpacity={0.6}>
                          <TrashIcon size={13} color="#f43f5e" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}

                <View style={styles.cardActionsRow}>
                  <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV} activeOpacity={0.8}>
                    <DownloadIcon size={14} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.exportBtnText}>Export CSV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clearBtn} onPress={handleClearSelectedDateExpenses} activeOpacity={0.7}>
                    <TrashIcon size={14} color="#f43f5e" style={{ marginRight: 6 }} />
                    <Text style={styles.clearBtnText}>Clear Date</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </div>

        </div>

        <Text style={[styles.fintechFooterText, theme.subtext]}>
          Enzo Soti &bull; Minimalist FinTech Budget Tracker Pro &bull; 100% Offline
        </Text>

      </ScrollView>

      {/* Attendance & Tardiness Sheet Modal */}
      <Modal visible={showAttendanceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, theme.card]}>
            <View style={styles.modalDragHandle} />
            <View style={styles.modalTopRow}>
              <View style={styles.headerIconGroup}>
                <CalendarIcon size={18} color="#10b981" />
                <Text style={[styles.modalHeading, theme.text]}>Attendance & Tardiness Sheet</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAttendanceModal(false)} activeOpacity={0.6}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
              <View style={[styles.modalBanner, theme.inputBg]}>
                <Text style={[styles.modalBannerText, theme.text]}>
                  Monthly Net: {formatPeso(parseFloat(monthlySalary) || 21000)} | Semi-Monthly Base: {formatPeso(userMonthly / 2)}{"\n"}
                  Daily Rate: {formatPeso(dailyWorkRate)} | Hourly: {formatPeso(dailyWorkRate / 8)} | Late: {formatPeso(minuteRate)}/min
                </Text>
              </View>

              <Text style={[styles.inputLabel, theme.subtext]}>
                Tap attendance badge to cycle status. Enter minutes late below:
              </Text>

              {/* Attendance & Tardy List */}
              <ScrollView style={{ maxHeight: 290 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={true}>
                {rangeDates.map(dateStr => {
                  const status = getResolvedStatus(dateStr);
                  const dayName = getDayNameStr(dateStr);
                  const isWorkingDay = status !== 'REST_DAY' && status !== 'ABSENT';
                  const dateTardyMins = tardyMap[dateStr] || 0;
                  const dateTardyDeduction = dateTardyMins * minuteRate;

                  return (
                    <View key={dateStr} style={[styles.attendanceCardItem, theme.inputBg]}>
                      <TouchableOpacity
                        style={styles.attItemHeader}
                        onPress={() => toggleAttendanceStatus(dateStr)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.attHeaderLeft}>
                          <Text style={[styles.attItemDate, theme.text]}>
                            {dateStr} ({dayName})
                          </Text>
                          {dateTardyMins > 0 && isWorkingDay && (
                            <View style={styles.tardyBadgeAmber}>
                              <ClockIcon size={10} color="#f59e0b" />
                              <Text style={styles.tardyBadgeText}>{dateTardyMins}m late (-{formatPeso(dateTardyDeduction)})</Text>
                            </View>
                          )}
                        </View>
                        
                        <View style={[
                          styles.attStatusPill,
                          status === 'FULL' || status === 'SAT_FULL' ? styles.statusPillFull :
                          status === 'HALF' ? styles.statusPillHalf : styles.statusPillAbsent
                        ]}>
                          <Text style={styles.attStatusPillText}>
                            {status === 'SAT_FULL' ? 'Sat (Full Pay)' :
                             status === 'FULL' ? 'Full Day' :
                             status === 'HALF' ? 'Half Day' :
                             status === 'REST_DAY' ? 'Sunday Rest' : 'Absent'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Tardy Input Row */}
                      {isWorkingDay && (
                        <View style={styles.tardyEditRow}>
                          <View style={styles.tardyEditLeft}>
                            <ClockIcon size={12} color={mutedIconColor} />
                            <Text style={[styles.tardyFieldLabel, theme.subtext]}>Tardy Minutes:</Text>
                          </View>
                          <TextInput
                            style={[styles.tardyInputBox, theme.card, theme.text]}
                            value={tardyMap[dateStr] !== undefined && tardyMap[dateStr] !== null ? tardyMap[dateStr].toString() : ''}
                            onChangeText={(val) => {
                              const num = parseInt(val, 10);
                              const newTardyMap = { ...tardyMap };
                              if (val.trim() === '' || isNaN(num) || num <= 0) {
                                delete newTardyMap[dateStr];
                              } else {
                                newTardyMap[dateStr] = num;
                              }
                              setTardyMap(newTardyMap);
                              saveData(dailySalaries, expenses, isDark, attendanceMap, { tardyMap: newTardyMap });
                            }}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              {/* Attendance Modal Summary Box */}
              <View style={[styles.salaryHeroBanner, theme.heroSalaryBg]}>
                <Text style={styles.heroTag}>NET CUT-OFF PAY AFTER DEDUCTIONS</Text>
                <Text className="fintech-mono" style={styles.heroSalaryValue}>
                  {formatPeso(calculatedCutoffSalary)}
                </Text>
                <View style={styles.salaryBreakdownStrip}>
                  <Text style={styles.breakdownMuted}>
                    Gross: {formatPeso(grossCutoffSalary)}
                  </Text>
                  {totalTardyMinutes > 0 && (
                    <Text style={styles.breakdownTardy}>
                      • Tardy: -{formatPeso(totalTardyDeduction)} ({totalTardyMinutes}m @ {formatPeso(minuteRate)}/m)
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.primaryAddBtn} onPress={() => setShowAttendanceModal(false)} activeOpacity={0.85}>
                <CheckIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryAddBtnText}>Save & Close Sheet</Text>
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
              <Text style={[styles.modalHeading, theme.text]}>Edit Expense Record</Text>
              <TouchableOpacity onPress={() => setEditItem(null)} activeOpacity={0.6}>
                <Text style={[styles.modalCloseX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, theme.subtext]}>Date</Text>
            <input
              type="date"
              className={dateInputClassName}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <Text style={[styles.inputLabel, theme.subtext]}>Expense Description</Text>
            <TextInput
              style={[styles.fintechTextInput, theme.inputBg, theme.text]}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={[styles.inputLabel, theme.subtext]}>Amount (₱)</Text>
            <TextInput
              style={[styles.fintechTextInput, theme.inputBg, theme.text]}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalActionsFlex}>
              <TouchableOpacity style={[styles.cancelBtn, theme.btnBg]} onPress={() => setEditItem(null)} activeOpacity={0.7}>
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAddBtn} onPress={handleSaveEdit} activeOpacity={0.85}>
                <Text style={styles.primaryAddBtnText}>Save Changes</Text>
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
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },

  /* FinTech Brand Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mainTitleAccent: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themePill: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* FinTech Segmented Navigation Tabs */
  segmentedTabBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabActive: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  segmentTabTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },

  /* FinTech Surface Cards */
  fintechCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  cardHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  attendanceBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Inputs */
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  fintechTextInput: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    fontSize: 14,
    fontWeight: '600',
    outlineWidth: 0,
    width: '100%',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  gridColumn: {
    flex: 1,
    gap: 6,
  },
  primaryAddBtn: {
    backgroundColor: '#10b981',
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryAddBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },

  /* FinTech Hero Salary Banner */
  salaryHeroBanner: {
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  heroBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: 1,
  },
  workdaysPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  workdaysPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981',
  },
  heroSalaryValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  salaryBreakdownStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  breakdownMuted: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  breakdownTardy: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '700',
  },

  /* Daily Budget Card Details */
  dateNavWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateNavArrow: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpTodayPill: {
    alignSelf: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
  },
  jumpTodayText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Daily Balance Hero Banner */
  dailyBalanceHero: {
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heroHealthy: {
    backgroundColor: '#059669',
  },
  heroWarning: {
    backgroundColor: '#d97706',
  },
  heroDanger: {
    backgroundColor: '#e11d48',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBalanceLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1,
  },
  statusPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  heroBalanceNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  dualStatRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniMetricBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 10,
    borderRadius: 10,
  },
  miniMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniMetricLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
  },
  miniMetricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 3,
  },
  editableSalaryInput: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
    padding: 0,
    width: '100%',
    outlineWidth: 0,
  },
  progressSection: {
    gap: 5,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSubLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
  },
  progressPctLabel: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 99,
    overflow: 'hidden',
  },

  /* Expense Records */
  expenseTotalHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f43f5e',
  },
  emptyStateBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  expenseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  expenseLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 120,
  },
  expenseTagIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseDetails: {
    flex: 1,
  },
  expName: {
    fontSize: 14,
    fontWeight: '700',
  },
  expDate: {
    fontSize: 11,
    marginTop: 1,
  },
  expenseRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f43f5e',
    marginRight: 2,
  },
  iconBtnAction: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  exportBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  clearBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f43f5e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    color: '#f43f5e',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Attendance Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 6,
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
  modalBanner: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalBannerText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  attendanceCardItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 10,
    gap: 8,
  },
  attItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  attHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  attItemDate: {
    fontSize: 13,
    fontWeight: '700',
  },
  tardyBadgeAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tardyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f59e0b',
  },
  attStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillFull: { backgroundColor: 'rgba(16, 185, 129, 0.18)' },
  statusPillHalf: { backgroundColor: 'rgba(245, 158, 11, 0.18)' },
  statusPillAbsent: { backgroundColor: 'rgba(244, 63, 94, 0.18)' },
  attStatusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  tardyEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 6,
  },
  tardyEditLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tardyFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tardyInputBox: {
    width: 65,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    outlineWidth: 0,
  },
  modalActionsFlex: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fintechFooterText: {
    textAlign: 'center',
    fontSize: 11,
    marginVertical: 10,
  }
});

// Curated Minimalist FinTech Palette (Linear / Stripe / Mercury style)
const darkTheme = {
  container: { backgroundColor: '#090d16' },
  card: { backgroundColor: '#101726', borderColor: 'rgba(255, 255, 255, 0.08)' },
  inputBg: { backgroundColor: '#0c121e', borderColor: 'rgba(255, 255, 255, 0.07)' },
  btnBg: { backgroundColor: '#0c121e', borderColor: 'rgba(255, 255, 255, 0.08)' },
  segmentBg: { backgroundColor: '#101726' },
  heroSalaryBg: { backgroundColor: '#0c1626' },
  text: { color: '#f8fafc' },
  subtext: { color: '#94a3b8' },
};

const lightTheme = {
  container: { backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  inputBg: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  btnBg: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  segmentBg: { backgroundColor: '#f1f5f9' },
  heroSalaryBg: { backgroundColor: '#ecfdf5' },
  text: { color: '#0f172a' },
  subtext: { color: '#64748b' },
};
