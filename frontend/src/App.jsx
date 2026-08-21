import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';

// Professional Vector SVG Icon Components (Linear / FinTech style)
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

const AlertTriangleIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </SvgIcon>
);

const CreditCardIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </SvgIcon>
);

const HistoryIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <polyline points="12 7 12 12 15 15" />
  </SvgIcon>
);

const CheckCircleIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </SvgIcon>
);

const ChevronDownIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </SvgIcon>
);

const ChevronUpIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="18 15 12 9 6 15" />
  </SvgIcon>
);

const PieChartIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </SvgIcon>
);

const PrinterIcon = (props) => (
  <SvgIcon {...props}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </SvgIcon>
);

const FileTextIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </SvgIcon>
);

const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food / Meals', icon: '🍔', prefix: 'Meal: ', color: '#f59e0b' },
  { id: 'transport', label: 'Transport', icon: '🚗', prefix: 'Fare / Gas: ', color: '#3b82f6' },
  { id: 'bills', label: 'Bills', icon: '⚡', prefix: 'Bill: ', color: '#8b5cf6' },
  { id: 'groceries', label: 'Groceries', icon: '🛒', prefix: 'Groceries: ', color: '#10b981' },
  { id: 'snacks', label: 'Coffee / Snacks', icon: '☕', prefix: 'Coffee: ', color: '#ec4899' },
  { id: 'health', label: 'Health', icon: '💊', prefix: 'Medicine: ', color: '#06b6d4' },
  { id: 'misc', label: 'Shopping', icon: '🛍️', prefix: 'Purchase: ', color: '#94a3b8' },
];

const DEBT_CATEGORIES = [
  { id: 'vehicle', label: 'Motorcycle / Vehicle', icon: '🏍️', color: '#f43f5e' },
  { id: 'personal', label: 'Personal Loan', icon: '🤝', color: '#fb923c' },
  { id: 'gadget', label: 'Gadget / Appliance', icon: '📱', color: '#a855f7' },
  { id: 'credit', label: 'Credit Card', icon: '💳', color: '#ef4444' },
  { id: 'housing', label: 'Housing / Rent', icon: '🏠', color: '#eab308' },
  { id: 'emergency', label: 'Emergency / Medical', icon: '🏥', color: '#14b8a6' },
  { id: 'other', label: 'Other Debt', icon: '📝', color: '#64748b' },
];

const AMOUNT_CHIPS = [50, 100, 200, 500, 1000];
const DEBT_PAYMENT_CHIPS = [500, 1000, 2000, 5000, 10000];

const getTodayString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
  const [dailySalaries, setDailySalaries] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [toast, setToast] = useState(null);
  
  const [monthlySalary, setMonthlySalary] = useState('21000');
  const [defaultDailyIncome, setDefaultDailyIncome] = useState('700');
  const [cutoffStart, setCutoffStart] = useState('2026-07-26');
  const [cutoffEnd, setCutoffEnd] = useState('2026-08-10');
  
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  const [cutoffBasePay, setCutoffBasePay] = useState('10500');
  const [pendingPayout, setPendingPayout] = useState('0');
  const [pendingPayoutNote, setPendingPayoutNote] = useState('');
  
  // Radix UI Dialog States
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Debt & Loan Tracker States
  const [debts, setDebts] = useState([]);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [editDebtItem, setEditDebtItem] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
  const [expandedDebts, setExpandedDebts] = useState({});
  const [debtFilter, setDebtFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'SETTLED'

  // Add / Edit Debt Form Fields
  const [debtTitle, setDebtTitle] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtCategory, setDebtCategory] = useState('vehicle');
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtMonthlyTarget, setDebtMonthlyTarget] = useState('');
  const [debtNotes, setDebtNotes] = useState('');

  // Payment Form Fields
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(getTodayString());
  const [paymentNote, setPaymentNote] = useState('');
  const [syncWithExpenses, setSyncWithExpenses] = useState(true);

  // Analytics & Calendar Heatmap States
  const [analyticsRange, setAnalyticsRange] = useState('CUTOFF'); // 'CUTOFF', 'MONTH', 'ALL'
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(null);

  // Map of Date -> Attendance Status ('FULL', 'SAT_FULL', 'HALF', 'SPECIAL_HOLIDAY', 'ABSENT', 'REST_DAY')
  const [attendanceMap, setAttendanceMap] = useState({});
  const [tardyMap, setTardyMap] = useState({});
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState(getTodayString());
  
  const [isDark, setIsDark] = useState(true);

  const showToast = (message, type = 'success', duration = 3200) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

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
        if (Array.isArray(parsed.debts)) {
          setDebts(parsed.debts);
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
        if (parsed.pendingPayout !== undefined) setPendingPayout(parsed.pendingPayout);
        if (parsed.pendingPayoutNote !== undefined) setPendingPayoutNote(parsed.pendingPayoutNote);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
        pendingPayout,
        pendingPayoutNote,
        debts,
        ...extra
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpandDebt = (id) => {
    setExpandedDebts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOpenAddDebt = () => {
    setDebtTitle('');
    setDebtAmount('');
    setDebtCategory('vehicle');
    setDebtDueDate('');
    setDebtMonthlyTarget('');
    setDebtNotes('');
    setShowAddDebtModal(true);
  };

  const handleCreateDebt = () => {
    const trimmedTitle = debtTitle.trim();
    const parsedAmount = parseFloat(debtAmount);

    if (!trimmedTitle) {
      showToast('Please enter a debt title or name!', 'error');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid debt amount greater than ₱0!', 'error');
      return;
    }

    const newDebt = {
      id: 'debt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: trimmedTitle,
      totalAmount: parsedAmount,
      category: debtCategory || 'vehicle',
      dueDate: debtDueDate || '',
      monthlyTarget: parseFloat(debtMonthlyTarget) || 0,
      notes: debtNotes.trim(),
      createdAt: getTodayString(),
      payments: []
    };

    const updated = [newDebt, ...debts];
    setDebts(updated);
    saveData(dailySalaries, expenses, isDark, attendanceMap, { debts: updated });
    setShowAddDebtModal(false);
    showToast(`✅ Added debt: "${trimmedTitle}" (${formatPeso(parsedAmount)})`, 'success');
  };

  const handleOpenEditDebt = (item) => {
    setEditDebtItem(item);
    setDebtTitle(item.title);
    setDebtAmount(item.totalAmount.toString());
    setDebtCategory(item.category || 'vehicle');
    setDebtDueDate(item.dueDate || '');
    setDebtMonthlyTarget(item.monthlyTarget ? item.monthlyTarget.toString() : '');
    setDebtNotes(item.notes || '');
  };

  const handleSaveEditDebt = () => {
    const trimmedTitle = debtTitle.trim();
    const parsedAmount = parseFloat(debtAmount);

    if (!trimmedTitle) {
      showToast('Debt title cannot be empty!', 'error');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Amount must be greater than ₱0!', 'error');
      return;
    }
    if (!editDebtItem) return;

    const updated = debts.map(d => {
      if (d.id === editDebtItem.id) {
        return {
          ...d,
          title: trimmedTitle,
          totalAmount: parsedAmount,
          category: debtCategory || 'vehicle',
          dueDate: debtDueDate || '',
          monthlyTarget: parseFloat(debtMonthlyTarget) || 0,
          notes: debtNotes.trim()
        };
      }
      return d;
    });

    setDebts(updated);
    saveData(dailySalaries, expenses, isDark, attendanceMap, { debts: updated });
    setEditDebtItem(null);
    showToast('Debt details updated successfully', 'success');
  };

  const promptDeleteDebt = (item) => {
    const paidSoFar = (item.payments || []).reduce((s, p) => s + p.amount, 0);
    setConfirmModal({
      title: `Delete Debt "${item.title}"?`,
      message: `Are you sure you want to delete this debt (${formatPeso(item.totalAmount)}) with ${item.payments?.length || 0} payment history records totaling ${formatPeso(paidSoFar)}? This action cannot be undone.`,
      confirmLabel: 'Delete Debt',
      isDanger: true,
      onConfirm: () => {
        const updated = debts.filter(d => d.id !== item.id);
        setDebts(updated);
        saveData(dailySalaries, expenses, isDark, attendanceMap, { debts: updated });
        showToast(`Deleted debt "${item.title}"`, 'success');
      }
    });
  };

  const handleOpenPaymentModal = (debt) => {
    setSelectedDebtForPayment(debt);
    setPaymentAmount(debt.monthlyTarget && debt.monthlyTarget > 0 ? debt.monthlyTarget.toString() : '');
    setPaymentDate(getTodayString());
    setPaymentNote(`Installment #${(debt.payments?.length || 0) + 1}`);
    setSyncWithExpenses(true);
    setShowPaymentModal(true);
  };

  const handleAddPaymentChip = (chipVal) => {
    const cur = parseFloat(paymentAmount) || 0;
    setPaymentAmount((cur + chipVal).toString());
  };

  const handleRecordPayment = () => {
    if (!selectedDebtForPayment) return;
    const amt = parseFloat(paymentAmount);

    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid installment amount!', 'error');
      return;
    }

    const curPaid = (selectedDebtForPayment.payments || []).reduce((s, p) => s + p.amount, 0);
    const remaining = Math.max(0, selectedDebtForPayment.totalAmount - curPaid);

    const paymentItem = {
      id: 'pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      debtId: selectedDebtForPayment.id,
      amount: amt,
      date: paymentDate || getTodayString(),
      note: paymentNote.trim() || `Installment payment`
    };

    let updatedExpenses = [...expenses];
    if (syncWithExpenses) {
      const newExp = {
        id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: `Loan/Debt Pay: ${selectedDebtForPayment.title}${paymentNote ? ` - ${paymentNote.trim()}` : ''}`,
        amount: amt,
        date: paymentDate || getTodayString(),
        debtPaymentId: paymentItem.id
      };
      updatedExpenses = [newExp, ...expenses];
      setExpenses(updatedExpenses);
    }

    const updatedDebts = debts.map(d => {
      if (d.id === selectedDebtForPayment.id) {
        const pList = [paymentItem, ...(d.payments || [])];
        return { ...d, payments: pList };
      }
      return d;
    });

    setDebts(updatedDebts);
    saveData(dailySalaries, updatedExpenses, isDark, attendanceMap, {
      debts: updatedDebts,
      expenses: updatedExpenses
    });

    setShowPaymentModal(false);
    setSelectedDebtForPayment(null);

    const newRemaining = Math.max(0, remaining - amt);
    if (newRemaining <= 0) {
      showToast(`🎉 Outstanding! "${selectedDebtForPayment.title}" is now FULLY PAID!`, 'success', 5000);
    } else {
      showToast(`✅ Recorded ${formatPeso(amt)} payment for "${selectedDebtForPayment.title}". Remaining: ${formatPeso(newRemaining)}`, 'success', 4000);
    }
  };

  const promptDeletePayment = (debt, payment) => {
    setConfirmModal({
      title: 'Delete Installment Record?',
      message: `Delete payment of ${formatPeso(payment.amount)} logged on ${payment.date}?`,
      confirmLabel: 'Delete Payment',
      isDanger: true,
      onConfirm: () => {
        // Also remove synced expense if exists
        const updatedExpenses = expenses.filter(e => e.debtPaymentId !== payment.id);
        if (updatedExpenses.length !== expenses.length) {
          setExpenses(updatedExpenses);
        }

        const updatedDebts = debts.map(d => {
          if (d.id === debt.id) {
            return {
              ...d,
              payments: (d.payments || []).filter(p => p.id !== payment.id)
            };
          }
          return d;
        });

        setDebts(updatedDebts);
        saveData(dailySalaries, updatedExpenses, isDark, attendanceMap, {
          debts: updatedDebts,
          expenses: updatedExpenses
        });
        showToast(`Deleted installment payment of ${formatPeso(payment.amount)}`, 'success');
      }
    });
  };

  const handleMonthlySalaryChange = (val) => {
    setMonthlySalary(val);
    const parsedMonthly = parseFloat(val);
    const newCutoffBase = !isNaN(parsedMonthly) && parsedMonthly > 0 ? (parsedMonthly / 2).toString() : '10500';
    setCutoffBasePay(newCutoffBase);
    saveData(dailySalaries, expenses, isDark, attendanceMap, { monthlySalary: val, cutoffBasePay: newCutoffBase });
  };

  const formatPeso = (num) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const changeDateByDays = (days) => {
    const parts = selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + days);
    const newStr = getTodayString(current);
    setSelectedDate(newStr);
    setExpenseDate(newStr);
  };

  const applyCutoffPreset = (presetType) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let start = '';
    let end = '';

    if (presetType === 'CUTOFF_1') {
      start = `${year}-${String(month + 1).padStart(2, '0')}-11`;
      end = `${year}-${String(month + 1).padStart(2, '0')}-25`;
      showToast(`Set to 1st Cut-off: ${start} → ${end}`, 'success');
    } else if (presetType === 'CUTOFF_2') {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      start = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-26`;
      end = `${year}-${String(month + 1).padStart(2, '0')}-10`;
      showToast(`Set to 2nd Cut-off: ${start} → ${end}`, 'success');
    } else if (presetType === 'FULL_MONTH') {
      const lastDay = new Date(year, month + 1, 0).getDate();
      start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      showToast(`Set to Full Month: ${start} → ${end}`, 'success');
    }

    if (start && end) {
      setCutoffStart(start);
      setCutoffEnd(end);
      saveData(dailySalaries, expenses, isDark, attendanceMap, { cutoffStart: start, cutoffEnd: end });
    }
  };

  const handleAddAmountChip = (chipValue) => {
    const currentVal = parseFloat(amount) || 0;
    const nextVal = currentVal + chipValue;
    setAmount(nextVal.toString());
  };

  const handleSelectCategory = (cat) => {
    if (!name || name.trim() === '' || EXPENSE_CATEGORIES.some(c => name.startsWith(c.prefix))) {
      setName(cat.prefix);
    } else {
      setName(`${cat.prefix}${name}`);
    }
  };

  const getResolvedStatus = (dateStr) => {
    if (attendanceMap[dateStr]) return attendanceMap[dateStr];
    if (isSunday(dateStr)) return 'REST_DAY';
    if (isSaturday(dateStr)) return 'SAT_FULL';
    return 'FULL';
  };

  const isDateRangeInvalid = cutoffEnd < cutoffStart;
  const rangeDates = !isDateRangeInvalid ? getDateRangeArray(cutoffStart, cutoffEnd) : [];
  
  let grossCutoffSalary = 0;
  let totalScheduledDays = 0;
  let totalAttendedDays = 0;
  let totalTardyMinutes = 0;

  const userMonthly = Math.max(0, parseFloat(monthlySalary) || 21000);
  const dailyWorkRate = userMonthly / 26;
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
    } else if (status === 'SPECIAL_HOLIDAY' || status === 'ABSENT' || status === 'REST_DAY') {
      // Special Non-Working Holiday (No Work, No Pay) = 0.0x multiplier
      multiplier = 0.0;
    }

    grossCutoffSalary += dailyWorkRate * multiplier;

    if (multiplier > 0 && tardyMap[d]) {
      const mins = Math.min(480, Math.max(0, parseFloat(tardyMap[d]) || 0));
      totalTardyMinutes += mins;
    }
  });

  const totalTardyDeduction = totalTardyMinutes * minuteRate;
  const netCalculatedCutoffSalary = Math.max(0, grossCutoffSalary - totalTardyDeduction);
  const baseCutoffPay = Math.round(netCalculatedCutoffSalary * 100) / 100;
  const additionalPayoutAmount = Math.max(0, parseFloat(pendingPayout) || 0);
  const calculatedCutoffSalary = Math.round((baseCutoffPay + additionalPayoutAmount) * 100) / 100;

  const currentDateSalary = dailySalaries[selectedDate] !== undefined 
    ? dailySalaries[selectedDate] 
    : (parseFloat(defaultDailyIncome) || 700);

  // Toggle Attendance status: FULL -> HALF -> SPECIAL_HOLIDAY (No Pay) -> ABSENT -> REST_DAY -> FULL
  const toggleAttendanceStatus = (dateStr) => {
    const current = getResolvedStatus(dateStr);
    let nextStatus = 'FULL';
    
    if (current === 'FULL' || current === 'SAT_FULL') nextStatus = 'HALF';
    else if (current === 'HALF') nextStatus = 'SPECIAL_HOLIDAY';
    else if (current === 'SPECIAL_HOLIDAY') nextStatus = 'ABSENT';
    else if (current === 'ABSENT') nextStatus = 'REST_DAY';
    else if (current === 'REST_DAY') nextStatus = 'FULL';

    const newAttMap = { ...attendanceMap, [dateStr]: nextStatus };
    setAttendanceMap(newAttMap);
    saveData(dailySalaries, expenses, isDark, newAttMap);
  };

  const handleAddExpense = (fromModal = false) => {
    const trimmedName = name.trim();
    const amt = parseFloat(amount);

    if (!trimmedName) {
      showToast('Please enter an expense description!', 'error');
      return;
    }

    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter an amount greater than ₱0!', 'error');
      return;
    }

    const targetDate = expenseDate || selectedDate;

    const newItem = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9),
      name: trimmedName,
      amount: amt,
      date: targetDate
    };

    const updated = [newItem, ...expenses];
    setExpenses(updated);
    saveData(dailySalaries, updated, isDark);

    setName('');
    setAmount('');
    if (fromModal) setShowAddModal(false);

    const existingDateTotal = expenses.filter(e => e.date === targetDate).reduce((s, i) => s + i.amount, 0);
    const newTotal = existingDateTotal + amt;
    const targetIncome = dailySalaries[targetDate] !== undefined ? dailySalaries[targetDate] : (parseFloat(defaultDailyIncome) || 700);

    if (newTotal > targetIncome) {
      showToast(`⚠️ Logged! Over budget by ${formatPeso(newTotal - targetIncome)} on ${targetDate}.`, 'warning', 4000);
    } else {
      showToast(`✅ Logged ${formatPeso(amt)} for "${trimmedName}"`, 'success');
    }
  };

  const promptDeleteExpense = (item) => {
    setConfirmModal({
      title: 'Delete Expense Record?',
      message: `Are you sure you want to delete "${item.name}" (-${formatPeso(item.amount)}) from ${item.date}? This action cannot be undone.`,
      confirmLabel: 'Delete Record',
      isDanger: true,
      onConfirm: () => {
        const updated = expenses.filter(exp => exp.id !== item.id);
        setExpenses(updated);
        saveData(dailySalaries, updated, isDark);
        showToast(`Deleted "${item.name}" (-${formatPeso(item.amount)})`, 'success');
      }
    });
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditDate(item.date || selectedDate);
  };

  const handleSaveEdit = () => {
    const amt = parseFloat(editAmount);
    if (!editName.trim()) {
      showToast('Description cannot be empty', 'error');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast('Amount must be greater than ₱0', 'error');
      return;
    }
    if (!editItem) return;

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
    showToast('Record updated successfully', 'success');
  };

  const promptClearDateExpenses = () => {
    const targetDateExpenses = expenses.filter(exp => exp.date === selectedDate);
    if (targetDateExpenses.length === 0) {
      showToast(`No expenses to clear for ${selectedDate}`, 'warning');
      return;
    }

    setConfirmModal({
      title: `Clear Expenses for ${selectedDate}?`,
      message: `You are about to delete all ${targetDateExpenses.length} expense(s) logged on ${selectedDate} (Total: ${formatPeso(totalDateExpenses)}). All other dates will remain safe.`,
      confirmLabel: `Clear ${targetDateExpenses.length} Expense(s)`,
      isDanger: true,
      onConfirm: () => {
        const updated = expenses.filter(exp => exp.date !== selectedDate);
        setExpenses(updated);
        saveData(dailySalaries, updated, isDark);
        showToast(`Cleared ${targetDateExpenses.length} expense(s) for ${selectedDate}`, 'success');
      }
    });
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('No expenses recorded to export', 'warning');
      return;
    }
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
    showToast('CSV export downloaded successfully', 'success');
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    saveData(dailySalaries, expenses, next);
  };

  const dateExpenses = expenses.filter(exp => exp.date === selectedDate);
  const totalDateExpenses = dateExpenses.reduce((sum, item) => sum + item.amount, 0);

  const remainingForDate = currentDateSalary - totalDateExpenses;
  const spentPctForDate = currentDateSalary > 0 ? Math.min(Math.round((totalDateExpenses / currentDateSalary) * 100), 999) : 0;

  const isOverBudget = remainingForDate < 0;
  const isCautionBudget = spentPctForDate >= 85 && !isOverBudget;

  // Debt & Loan Metrics Calculations
  const totalDebtPrincipal = debts.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const totalDebtPaid = debts.reduce((sum, d) => {
    const paidForDebt = (d.payments || []).reduce((pSum, p) => pSum + (p.amount || 0), 0);
    return sum + paidForDebt;
  }, 0);
  const totalDebtRemaining = Math.max(0, totalDebtPrincipal - totalDebtPaid);
  const overallPayoffPct = totalDebtPrincipal > 0 ? Math.min(100, Math.round((totalDebtPaid / totalDebtPrincipal) * 100)) : 0;
  
  const activeDebts = debts.filter(d => {
    const paid = (d.payments || []).reduce((s, p) => s + p.amount, 0);
    return paid < d.totalAmount;
  });
  const settledDebts = debts.filter(d => {
    const paid = (d.payments || []).reduce((s, p) => s + p.amount, 0);
    return paid >= d.totalAmount && d.totalAmount > 0;
  });

  const filteredDebts = debtFilter === 'ACTIVE' 
    ? activeDebts 
    : debtFilter === 'SETTLED' 
    ? settledDebts 
    : debts;

  const theme = isDark ? darkTheme : lightTheme;
  const dateInputClassName = isDark ? "modern-date-input" : "modern-date-input light-theme-picker";
  const iconColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedIconColor = isDark ? "#94a3b8" : "#64748b";

  // Analytics Filtered Expenses
  const currentMonthPrefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
  
  const analyticsExpenses = analyticsRange === 'CUTOFF'
    ? expenses.filter(e => e.date >= cutoffStart && e.date <= cutoffEnd)
    : analyticsRange === 'MONTH'
    ? expenses.filter(e => e.date.startsWith(currentMonthPrefix))
    : expenses;

  const totalAnalyticsExpense = analyticsExpenses.reduce((s, e) => s + e.amount, 0);

  // Categorize Expenses for Analytics
  const ALL_ANALYTICS_CATEGORIES = [
    ...EXPENSE_CATEGORIES,
    { id: 'debts', label: 'Debt Payments', icon: '🏍️', prefix: 'Loan/Debt Pay:', color: '#f43f5e' }
  ];

  const categoryBreakdown = ALL_ANALYTICS_CATEGORIES.map(cat => {
    let catExpenses = [];
    if (cat.id === 'debts') {
      catExpenses = analyticsExpenses.filter(e => e.debtPaymentId || e.name.toLowerCase().startsWith('loan/debt pay:'));
    } else if (cat.id === 'misc') {
      catExpenses = analyticsExpenses.filter(e => {
        if (e.debtPaymentId || e.name.toLowerCase().startsWith('loan/debt pay:')) return false;
        const matchesOther = EXPENSE_CATEGORIES.slice(0, 6).some(c => e.name.toLowerCase().startsWith(c.prefix.toLowerCase()) || e.name.toLowerCase().includes(c.label.toLowerCase()));
        return !matchesOther;
      });
    } else {
      catExpenses = analyticsExpenses.filter(e => {
        if (e.debtPaymentId || e.name.toLowerCase().startsWith('loan/debt pay:')) return false;
        return e.name.toLowerCase().startsWith(cat.prefix.toLowerCase()) || e.name.toLowerCase().includes(cat.label.toLowerCase());
      });
    }
    const catTotal = catExpenses.reduce((s, e) => s + e.amount, 0);
    const catPct = totalAnalyticsExpense > 0 ? Math.round((catTotal / totalAnalyticsExpense) * 100) : 0;
    return {
      ...cat,
      total: catTotal,
      pct: catPct,
      count: catExpenses.length
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  // Calendar Heatmap Generation
  const calendarMonthName = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInCalendarMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
  
  const calendarDays = [];
  // Leading empty slots
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ isEmpty: true, id: `empty-${i}` });
  }
  // Month days
  for (let d = 1; d <= daysInCalendarMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${dayStr}`;
    const dayExps = expenses.filter(e => e.date === dateStr);
    const dayTotalSpent = dayExps.reduce((s, e) => s + e.amount, 0);
    const dayLimit = dailySalaries[dateStr] !== undefined ? dailySalaries[dateStr] : (parseFloat(defaultDailyIncome) || 0);
    
    let status = 'NEUTRAL';
    if (dayTotalSpent > 0) {
      if (dayLimit <= 0 || dayTotalSpent > dayLimit) {
        status = 'DANGER';
      } else if (dayTotalSpent >= dayLimit * 0.85) {
        status = 'CAUTION';
      } else {
        status = 'HEALTHY';
      }
    }
    
    const isCutoffStartDay = dateStr === cutoffStart;
    const isCutoffEndDay = dateStr === cutoffEnd;
    const isInCurrentCutoff = dateStr >= cutoffStart && dateStr <= cutoffEnd;
    const isPayday = isCutoffEndDay;
    const hasDebtEvent = debts.some(debt => debt.dueDate === dateStr || (debt.payments || []).some(p => p.date === dateStr));
    const isToday = dateStr === getTodayString();
    const isSelected = dateStr === selectedDate;
    const attStatus = getResolvedStatus(dateStr);
    const tardyMins = tardyMap[dateStr] || 0;
    
    calendarDays.push({
      isEmpty: false,
      dayNumber: d,
      dateStr,
      dayTotalSpent,
      dayLimit,
      status,
      isCutoffStartDay,
      isCutoffEndDay,
      isInCurrentCutoff,
      attStatus,
      tardyMins,
      isPayday,
      hasDebtEvent,
      isToday,
      isSelected,
      expenseCount: dayExps.length
    });
  }

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleJumpToCurrentMonth = () => {
    const now = new Date();
    setCalendarYear(now.getFullYear());
    setCalendarMonth(now.getMonth());
  };

  // Cut-off Statement Computations
  const cutoffExpenses = expenses.filter(e => e.date >= cutoffStart && e.date <= cutoffEnd);
  const cutoffExpensesTotal = cutoffExpenses.reduce((s, e) => s + e.amount, 0);
  const cutoffDebtPayments = cutoffExpenses.filter(e => e.debtPaymentId || e.name.toLowerCase().startsWith('loan/debt pay:'));
  const cutoffDebtsTotal = cutoffDebtPayments.reduce((s, e) => s + e.amount, 0);
  const cutoffNetFreeCash = calculatedCutoffSalary - cutoffExpensesTotal;

  const showSalaryCard = activeTab === 'ALL' || activeTab === 'SALARY';
  const showDailyCard = activeTab === 'ALL' || activeTab === 'DAILY';
  const showExpenseForm = activeTab === 'ALL' || activeTab === 'EXPENSES' || activeTab === 'DAILY';
  const showExpenseList = activeTab === 'ALL' || activeTab === 'EXPENSES' || activeTab === 'DAILY';
  const showDebtsManager = activeTab === 'DEBTS';
  const showDebtsOverview = activeTab === 'ALL';
  const showCalendarView = activeTab === 'CALENDAR';

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Floating Animated Toast Alert */}
      {toast && (
        <View style={[
          styles.toastPopup,
          toast.type === 'error' ? styles.toastError :
          toast.type === 'warning' ? styles.toastWarning : styles.toastSuccess
        ]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      {/* FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity
        style={styles.floatingActionBtn}
        onPress={() => {
          if (activeTab === 'DEBTS') {
            handleOpenAddDebt();
          } else {
            setExpenseDate(selectedDate);
            setShowAddModal(true);
          }
        }}
        activeOpacity={0.85}
      >
        <PlusIcon size={24} color="#ffffff" />
      </TouchableOpacity>

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
                {formatPeso(parseFloat(monthlySalary) || 21000)} /mo Net Salary
              </Text>
            </View>
          </View>

          <View style={styles.topRightControls}>
            <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme} activeOpacity={0.7}>
              {isDark ? <SunIcon size={16} color="#f59e0b" /> : <MoonIcon size={16} color="#10b981" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Linear FinTech Segmented Navigation Tabs (Smooth Horizontal Scroll on Mobile) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.segmentedTabBar, theme.segmentBg]}
          style={styles.tabScrollWrapper}
        >
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
            style={[styles.segmentTab, activeTab === 'CALENDAR' && styles.segmentTabActive]}
            onPress={() => setActiveTab('CALENDAR')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'CALENDAR' ? styles.segmentTabTextActive : theme.subtext]}>
              Calendar
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

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'DEBTS' && styles.segmentTabActive]}
            onPress={() => setActiveTab('DEBTS')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'DEBTS' ? styles.segmentTabTextActive : theme.subtext]}>
              Debts & Loans{activeDebts.length > 0 ? ` (${activeDebts.length})` : ''}
            </Text>
          </TouchableOpacity>
        </ScrollView>

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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <TouchableOpacity style={[styles.presetPill, theme.btnBg, { flexDirection: 'row', alignItems: 'center', gap: 4 }]} onPress={() => setShowReportModal(true)} activeOpacity={0.85}>
                      <FileTextIcon size={13} color="#10b981" />
                      <Text style={[styles.presetPillText, { color: '#10b981', fontWeight: '800' }]}>Statement</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attendanceBtn} onPress={() => setShowAttendanceModal(true)} activeOpacity={0.85}>
                      <CalendarIcon size={14} color="#ffffff" style={{ marginRight: 5 }} />
                      <Text style={styles.attendanceBtnText}>Attendance</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 1-TAP CUT-OFF PRESETS */}
                <View style={styles.presetSection}>
                  <Text style={[styles.inputLabel, theme.subtext]}>⚡ 1-Tap Cut-off Presets:</Text>
                  <View style={styles.presetPillsRow}>
                    <TouchableOpacity
                      style={[styles.presetPill, theme.inputBg]}
                      onPress={() => applyCutoffPreset('CUTOFF_2')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.presetPillText, theme.text]}>2nd Cut-off (26-10)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.presetPill, theme.inputBg]}
                      onPress={() => applyCutoffPreset('CUTOFF_1')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.presetPillText, theme.text]}>1st Cut-off (11-25)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.presetPill, theme.inputBg]}
                      onPress={() => applyCutoffPreset('FULL_MONTH')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.presetPillText, theme.text]}>Full Month</Text>
                    </TouchableOpacity>
                  </View>
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

                {/* Pending Payout / Finance Addition Input */}
                <View style={styles.inputGroup}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.inputLabel, theme.subtext]}>
                      Pending Payout / Finance Addition (+₱)
                    </Text>
                    {additionalPayoutAmount > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setPendingPayout('0');
                          setPendingPayoutNote('');
                          saveData(dailySalaries, expenses, isDark, attendanceMap, { pendingPayout: '0', pendingPayoutNote: '' });
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 11, color: '#f43f5e', fontWeight: '700' }}>Clear (₱0)</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TextInput
                      style={[styles.fintechTextInput, theme.inputBg, theme.text, { flex: 1 }]}
                      value={pendingPayout}
                      onChangeText={(val) => {
                        const sanitized = val.replace(/[^0-9.]/g, '');
                        setPendingPayout(sanitized);
                        saveData(dailySalaries, expenses, isDark, attendanceMap, { pendingPayout: sanitized });
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    />
                    <TextInput
                      style={[styles.fintechTextInput, theme.inputBg, theme.text, { flex: 1.5 }]}
                      value={pendingPayoutNote}
                      onChangeText={(val) => {
                        setPendingPayoutNote(val);
                        saveData(dailySalaries, expenses, isDark, attendanceMap, { pendingPayoutNote: val });
                      }}
                      placeholder="Note: e.g. Pending from Finance"
                      placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    />
                  </View>
                </View>

                {/* Date Restriction Warning */}
                {isDateRangeInvalid && (
                  <View style={styles.dangerAlertBox}>
                    <AlertTriangleIcon size={16} color="#f43f5e" />
                    <Text style={styles.dangerAlertText}>
                      Invalid Date Range: End Date must be after or equal to Start Date.
                    </Text>
                  </View>
                )}

                {/* FinTech Salary Result Banner */}
                {!isDateRangeInvalid && (
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
                        Base: {formatPeso(baseCutoffPay)}
                      </Text>
                      {additionalPayoutAmount > 0 && (
                        <Text style={{ color: '#10b981', fontWeight: '800', fontSize: 11 }}>
                          • +Addition: +{formatPeso(additionalPayoutAmount)} {pendingPayoutNote ? `(${pendingPayoutNote})` : ''}
                        </Text>
                      )}
                      {totalTardyMinutes > 0 && (
                        <Text style={styles.breakdownTardy}>
                          • Tardy: -{formatPeso(totalTardyDeduction)} ({totalTardyMinutes}m)
                        </Text>
                      )}
                    </View>
                  </View>
                )}
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

                {/* Quick Category Selector */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, theme.subtext]}>Quick Categories:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryChip, theme.inputBg]}
                        onPress={() => handleSelectCategory(cat)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 13, marginRight: 4 }}>{cat.icon}</Text>
                        <Text style={[styles.categoryChipText, theme.text]}>{cat.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, theme.subtext]}>Expense Date</Text>
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
                    placeholder="e.g. Groceries, Lunch, Internet Bill..."
                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Amount with Quick Chips */}
                <View style={styles.inputGroup}>
                  <View style={styles.amountHeaderRow}>
                    <Text style={[styles.inputLabel, theme.subtext]}>Amount (₱)</Text>
                    <View style={styles.chipsRow}>
                      {AMOUNT_CHIPS.map(chip => (
                        <TouchableOpacity
                          key={chip}
                          style={[styles.amountChip, theme.inputBg]}
                          onPress={() => handleAddAmountChip(chip)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.amountChipText}>+{chip}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TextInput
                    style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                <TouchableOpacity style={styles.primaryAddBtn} onPress={() => handleAddExpense(false)} activeOpacity={0.85}>
                  <Text style={styles.primaryAddBtnText}>+ Add Expense to {expenseDate}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* DEBTS & LOANS SUMMARY WIDGET (OVERVIEW TAB) */}
            {showDebtsOverview && (
              <View style={[styles.fintechCard, theme.card]}>
                <View style={styles.cardHeaderFlex}>
                  <View style={styles.headerIconGroup}>
                    <CreditCardIcon size={17} color="#10b981" />
                    <Text style={[styles.cardTitle, theme.text]}>Debts & Loans Tracker</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.attendanceBtn}
                    onPress={() => setActiveTab('DEBTS')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.attendanceBtnText}>Manage All →</Text>
                  </TouchableOpacity>
                </View>

                {debts.length === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <CreditCardIcon size={30} color={mutedIconColor} style={{ marginBottom: 6 }} />
                    <Text style={[styles.emptyTitle, theme.text]}>No Debts or Loans Logged</Text>
                    <Text style={[styles.emptySubtitle, theme.subtext]}>
                      Record loans (e.g. Motorcycle ₱80k), amortization, & fees.
                    </Text>
                    <TouchableOpacity
                      style={[styles.primaryAddBtn, { marginTop: 12 }]}
                      onPress={handleOpenAddDebt}
                      activeOpacity={0.85}
                    >
                      <PlusIcon size={15} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.primaryAddBtnText}>+ Record a Debt / Loan</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={[styles.debtOverviewBanner, theme.inputBg]}>
                      <View style={styles.debtOverviewTop}>
                        <View>
                          <Text style={[styles.inputLabel, theme.subtext]}>TOTAL OUTSTANDING DEBT</Text>
                          <Text className="fintech-mono" style={[styles.debtTotalRemainingText, totalDebtRemaining > 0 ? styles.textDanger : styles.textSuccess]}>
                            {formatPeso(totalDebtRemaining)}
                          </Text>
                        </View>
                        <View style={styles.debtPayoffBadge}>
                          <Text style={styles.debtPayoffBadgeText}>{overallPayoffPct}% Paid Off</Text>
                        </View>
                      </View>

                      <View style={styles.progressBarTrack}>
                        <div
                          className="progress-bar-animated"
                          style={{
                            height: '100%',
                            backgroundColor: '#10b981',
                            borderRadius: 99,
                            width: `${Math.min(overallPayoffPct, 100)}%`
                          }}
                        />
                      </View>

                      <View style={styles.debtOverviewFooter}>
                        <Text style={[styles.breakdownMuted, theme.subtext]}>
                          Repaid: {formatPeso(totalDebtPaid)} / {formatPeso(totalDebtPrincipal)}
                        </Text>
                        <Text style={[styles.breakdownMuted, theme.subtext]}>
                          {activeDebts.length} active &bull; {settledDebts.length} settled
                        </Text>
                      </View>
                    </View>

                    {/* Quick Mini List of Active Debts */}
                    <View style={{ gap: 8 }}>
                      {activeDebts.slice(0, 3).map(debt => {
                        const paidAmt = (debt.payments || []).reduce((s, p) => s + p.amount, 0);
                        const remAmt = Math.max(0, debt.totalAmount - paidAmt);
                        const catObj = DEBT_CATEGORIES.find(c => c.id === debt.category) || DEBT_CATEGORIES[0];
                        return (
                          <View key={debt.id} style={[styles.debtMiniItemRow, theme.inputBg]}>
                            <View style={styles.debtMiniLeft}>
                              <Text style={{ fontSize: 16 }}>{catObj.icon}</Text>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.expName, theme.text]} numberOfLines={1}>{debt.title}</Text>
                                <Text style={[styles.expDate, theme.subtext]}>
                                  Bal: {formatPeso(remAmt)} ({Math.round((paidAmt / debt.totalAmount) * 100)}% paid)
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.debtMiniPayBtn}
                              onPress={() => handleOpenPaymentModal(debt)}
                              activeOpacity={0.8}
                            >
                              <PlusIcon size={12} color="#ffffff" style={{ marginRight: 4 }} />
                              <Text style={styles.debtMiniPayBtnText}>Pay</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>

                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={styles.primaryAddBtn}
                        onPress={handleOpenAddDebt}
                        activeOpacity={0.85}
                      >
                        <PlusIcon size={14} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text style={styles.primaryAddBtnText}>+ Add Debt</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cancelBtn, theme.btnBg, { flex: 1 }]}
                        onPress={() => setActiveTab('DEBTS')}
                        activeOpacity={0.7}
                      >
                        <Text style={[theme.text, { fontWeight: '700', fontSize: 13 }]}>Manage Debts →</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
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

                {/* Overspending Banner Alert */}
                {isOverBudget && (
                  <View style={styles.dangerAlertBox}>
                    <AlertTriangleIcon size={16} color="#f43f5e" />
                    <Text style={styles.dangerAlertText}>
                      Over Budget! Exceeded by {formatPeso(Math.abs(remainingForDate))} on {selectedDate}.
                    </Text>
                  </View>
                )}

                {isCautionBudget && (
                  <View style={styles.warningAlertBox}>
                    <AlertTriangleIcon size={16} color="#f59e0b" />
                    <Text style={styles.warningAlertText}>
                      Caution: You have spent {spentPctForDate}% of today's daily income limit.
                    </Text>
                  </View>
                )}

                {/* Hero Balance Card */}
                <View style={[
                  styles.dailyBalanceHero,
                  isOverBudget ? styles.heroDanger :
                  isCautionBudget ? styles.heroWarning : styles.heroHealthy
                ]}>
                  <View style={styles.heroTopRow}>
                    <Text style={styles.heroBalanceLabel}>REMAINING BUDGET FOR {selectedDate}</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>
                        {isOverBudget ? 'Over Budget' : isCautionBudget ? 'Caution' : 'Healthy'}
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
                            updatedSalaries[selectedDate] = Math.max(0, parsed);
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
                    <Text style={[styles.emptySubtitle, theme.subtext]}>Tap the floating "+" button to quickly log expenses.</Text>
                  </View>
                ) : (
                  dateExpenses.map(item => (
                    <View key={item.id} style={[styles.expenseItemRow, theme.inputBg]}>
                      <View style={styles.expenseLeftCol}>
                        <View style={styles.expenseTagIconBox}>
                          <ReceiptIcon size={15} color="#f43f5e" />
                        </View>
                        <View style={styles.expenseDetails}>
                          <Text style={[styles.expName, theme.text]} numberOfLines={1}>{item.name}</Text>
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
                        <TouchableOpacity onPress={() => promptDeleteExpense(item)} style={[styles.iconBtnAction, theme.btnBg]} activeOpacity={0.6}>
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
                  <TouchableOpacity style={styles.clearBtn} onPress={promptClearDateExpenses} activeOpacity={0.7}>
                    <TrashIcon size={14} color="#f43f5e" style={{ marginRight: 6 }} />
                    <Text style={styles.clearBtnText}>Clear Date</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* FEATURE 4: FINANCIAL CALENDAR & BUDGET HEATMAP (CALENDAR TAB) */}
            {showCalendarView && (
              <View style={[styles.fintechCard, theme.card]}>
                <View style={styles.cardHeaderFlex}>
                  <View style={styles.headerIconGroup}>
                    <CalendarIcon size={18} color="#10b981" />
                    <View>
                      <Text style={[styles.cardTitle, theme.text]}>Financial Calendar & Heatmap</Text>
                      <Text style={[styles.mainSubtitle, theme.subtext]}>
                        Tap any date to inspect & log daily budget
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <TouchableOpacity style={[styles.dateNavArrow, theme.btnBg, { width: 34, height: 34 }]} onPress={handlePrevMonth} activeOpacity={0.7}>
                      <ChevronLeftIcon size={13} color={iconColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.presetPill, theme.inputBg, { paddingHorizontal: 10, paddingVertical: 5 }]} onPress={handleJumpToCurrentMonth} activeOpacity={0.7}>
                      <Text style={[styles.presetPillText, theme.text, { fontSize: 11, fontWeight: '800' }]}>{calendarMonthName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.dateNavArrow, theme.btnBg, { width: 34, height: 34 }]} onPress={handleNextMonth} activeOpacity={0.7}>
                      <ChevronRightIcon size={13} color={iconColor} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Active Cut-off Indicator Banner & Auto-Calculated Cut-off Pay */}
                <View style={[styles.presetSection, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.09)' : 'rgba(16, 185, 129, 0.08)', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.25)', gap: 8 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <BriefcaseIcon size={14} color="#10b981" />
                      <Text style={[{ fontSize: 12, fontWeight: '700' }, theme.text]}>
                        Current Cut-off: <Text style={{ color: '#10b981', fontWeight: '900' }}>{cutoffStart}</Text> ➔ <Text style={{ color: '#f59e0b', fontWeight: '900' }}>{cutoffEnd}</Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.presetPill, { backgroundColor: '#10b981', paddingVertical: 4, paddingHorizontal: 8 }]}
                      onPress={() => {
                        try {
                          const [y, m] = cutoffStart.split('-').map(Number);
                          setCalendarYear(y);
                          setCalendarMonth(m - 1);
                        } catch (e) {}
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '800' }}>Jump to Cut-off Month</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Compact Auto-Calculated Cut-off Pay Pill */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text style={{ fontSize: 9.5, fontWeight: '800', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Cut-off Pay:
                      </Text>
                      <Text className="fintech-mono" style={{ fontSize: 14, fontWeight: '900', color: '#10b981' }}>
                        {formatPeso(calculatedCutoffSalary)}
                      </Text>
                      {additionalPayoutAmount > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' }}>
                          +{formatPeso(additionalPayoutAmount)} {pendingPayoutNote ? `(${pendingPayoutNote})` : 'Addition'}
                        </span>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[styles.workdaysPill, { paddingVertical: 2, paddingHorizontal: 6 }]}>
                        <Text style={[styles.workdaysPillText, { fontSize: 9.5 }]}>
                          {totalAttendedDays} Workdays
                        </Text>
                      </View>
                      {totalTardyDeduction > 0 && (
                        <Text style={[styles.breakdownTardy, { fontSize: 9.5 }]}>
                          Tardy: -{formatPeso(totalTardyDeduction)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Heatmap & Attendance Legend Bar */}
                <View style={[styles.calendarLegendRow, { gap: 6 }]}>
                  <View style={styles.legendItem}>
                    <Text style={{ fontSize: 10 }}>🚀</Text>
                    <Text style={[styles.legendText, { color: '#10b981', fontWeight: '800' }]}>Start Date</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <Text style={{ fontSize: 10 }}>💰</Text>
                    <Text style={[styles.legendText, { color: '#f59e0b', fontWeight: '800' }]}>End Date</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.attStatusPill, styles.statusPillFull, { paddingHorizontal: 6, paddingVertical: 2 }]}>
                      <Text style={[styles.attStatusPillText, { fontSize: 9 }]}>Full (1.0x)</Text>
                    </View>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.attStatusPill, styles.statusPillHalf, { paddingHorizontal: 6, paddingVertical: 2 }]}>
                      <Text style={[styles.attStatusPillText, { fontSize: 9, color: '#f59e0b' }]}>Half (0.5x)</Text>
                    </View>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.attStatusPill, styles.statusPillHoliday, { paddingHorizontal: 6, paddingVertical: 2 }]}>
                      <Text style={[styles.attStatusPillText, styles.statusHolidayText, { fontSize: 9 }]}>Holiday (0x)</Text>
                    </View>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.attStatusPill, styles.statusPillAbsent, { paddingHorizontal: 6, paddingVertical: 2 }]}>
                      <Text style={[styles.attStatusPillText, { fontSize: 9, color: '#f43f5e' }]}>Absent (0x)</Text>
                    </View>
                  </View>
                </View>

                {/* Calendar 7-Day Header */}
                <View style={styles.calendarGridWeekHeader}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                    <Text key={d} style={[styles.calendarDayHeaderCell, (i === 0 || i === 6) ? { color: '#f59e0b' } : theme.subtext]}>
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Calendar Days 7xN Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, width: '100%' }}>
                  {calendarDays.map((item) => {
                    if (item.isEmpty) {
                      return <div key={item.id} style={{ minHeight: 74, opacity: 0 }} />;
                    }

                    const statusBg = item.isCutoffStartDay
                      ? (isDark ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.18)')
                      : item.isCutoffEndDay
                      ? (isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.18)')
                      : item.isInCurrentCutoff
                      ? (item.status === 'DANGER'
                          ? (isDark ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.16)')
                          : item.status === 'CAUTION'
                          ? (isDark ? 'rgba(245, 158, 11, 0.18)' : 'rgba(245, 158, 11, 0.16)')
                          : (isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)'))
                      : item.status === 'HEALTHY'
                      ? (isDark ? 'rgba(16, 185, 129, 0.10)' : 'rgba(16, 185, 129, 0.06)')
                      : item.status === 'CAUTION'
                      ? (isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.10)')
                      : item.status === 'DANGER'
                      ? (isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.12)')
                      : (isDark ? '#0c121e' : '#f8fafc');

                    const borderColor = item.isSelected
                      ? '#10b981'
                      : item.isCutoffStartDay
                      ? '#10b981'
                      : item.isCutoffEndDay
                      ? '#f59e0b'
                      : item.isInCurrentCutoff
                      ? (isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.4)')
                      : item.isToday
                      ? '#3b82f6'
                      : (isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0');

                    const borderWidth = (item.isSelected || item.isCutoffStartDay || item.isCutoffEndDay) ? '2px' : item.isInCurrentCutoff ? '1.5px' : '1px';

                    return (
                      <div
                        key={item.dateStr}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setExpenseDate(item.dateStr);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '5px 4px',
                          minHeight: 74,
                          borderRadius: 8,
                          border: `${borderWidth} solid ${borderColor}`,
                          backgroundColor: statusBg,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        {/* Day Top Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: (item.isToday || item.isCutoffStartDay || item.isCutoffEndDay) ? 900 : 700, color: item.isToday ? '#3b82f6' : (isDark ? '#f8fafc' : '#0f172a') }}>
                            {item.dayNumber}
                          </span>
                          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {item.tardyMins > 0 && (
                              <span title={`Tardy: ${item.tardyMins}m`} style={{ fontSize: 7.5, color: '#f59e0b', fontWeight: 800 }}>
                                ⏱️{item.tardyMins}m
                              </span>
                            )}
                            {item.hasDebtEvent && <span title="Debt Event" style={{ fontSize: 9 }}>💳</span>}
                          </div>
                        </div>

                        {/* Cut-off & Attendance Indicator Badges */}
                        <div style={{ margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {item.isCutoffStartDay && (
                            <span style={{
                              fontSize: 7,
                              fontWeight: 900,
                              backgroundColor: '#10b981',
                              color: '#ffffff',
                              borderRadius: 4,
                              padding: '1px 2px',
                              textAlign: 'center',
                              lineHeight: 1.1,
                              display: 'block'
                            }}>
                              🚀 START
                            </span>
                          )}
                          {item.isCutoffEndDay && (
                            <span style={{
                              fontSize: 7,
                              fontWeight: 900,
                              backgroundColor: '#f59e0b',
                              color: '#ffffff',
                              borderRadius: 4,
                              padding: '1px 2px',
                              textAlign: 'center',
                              lineHeight: 1.1,
                              display: 'block'
                            }}>
                              💰 END / PAY
                            </span>
                          )}

                          {/* Attendance Status Badge */}
                          <span style={{
                            fontSize: 6.5,
                            fontWeight: 800,
                            borderRadius: 3,
                            padding: '1px 2px',
                            textAlign: 'center',
                            lineHeight: 1.1,
                            display: 'block',
                            backgroundColor:
                              item.attStatus === 'FULL' || item.attStatus === 'SAT_FULL' ? (isDark ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.16)') :
                              item.attStatus === 'HALF' ? (isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.18)') :
                              item.attStatus === 'SPECIAL_HOLIDAY' ? (isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.2)') :
                              item.attStatus === 'REST_DAY' ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') :
                              (isDark ? 'rgba(244, 63, 94, 0.25)' : 'rgba(244, 63, 94, 0.2)'),
                            color:
                              item.attStatus === 'FULL' || item.attStatus === 'SAT_FULL' ? '#10b981' :
                              item.attStatus === 'HALF' ? '#f59e0b' :
                              item.attStatus === 'SPECIAL_HOLIDAY' ? '#c084fc' :
                              item.attStatus === 'REST_DAY' ? (isDark ? '#64748b' : '#94a3b8') :
                              '#f43f5e'
                          }}>
                            {item.attStatus === 'SAT_FULL' ? 'Sat (1.0x)' :
                             item.attStatus === 'FULL' ? 'Full (1.0x)' :
                             item.attStatus === 'HALF' ? 'Half (0.5x)' :
                             item.attStatus === 'SPECIAL_HOLIDAY' ? 'Holiday (0x)' :
                             item.attStatus === 'REST_DAY' ? 'Sunday' : 'Absent (0x)'}
                          </span>
                        </div>

                        {/* Day Bottom Expense Total */}
                        <div style={{ marginTop: 1 }}>
                          {item.dayTotalSpent > 0 ? (
                            <span className="fintech-mono" style={{ fontSize: 9, fontWeight: 800, color: item.status === 'DANGER' ? '#f43f5e' : item.status === 'CAUTION' ? '#f59e0b' : '#10b981', display: 'block', wordBreak: 'break-all' }}>
                              -{formatPeso(item.dayTotalSpent)}
                            </span>
                          ) : (
                            <span style={{ fontSize: 8, color: isDark ? '#475569' : '#94a3b8' }}>—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </View>
            )}

          </div>

        </div>

        {/* FULL DEBT & LOAN MANAGER (DEBTS TAB) */}
        {showDebtsManager && (
          <View style={[styles.fintechCard, theme.card, { width: '100%' }]}>
            <View style={styles.cardHeaderFlex}>
              <View style={styles.headerIconGroup}>
                <CreditCardIcon size={20} color="#10b981" />
                <View>
                  <Text style={[styles.cardTitle, theme.text, { fontSize: 17 }]}>Debt & Loan Manager</Text>
                  <Text style={[styles.mainSubtitle, theme.subtext, { marginTop: 1 }]}>
                    Track loans, amortization schedules & record installment payments
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.primaryAddBtn}
                onPress={handleOpenAddDebt}
                activeOpacity={0.85}
              >
                <PlusIcon size={15} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryAddBtnText}>+ Add Debt / Loan</Text>
              </TouchableOpacity>
            </View>

            {/* Hero Balance & Overview Stats */}
            <View style={[styles.debtManagerHeroBanner, theme.heroSalaryBg]}>
              <View style={styles.heroBannerHeader}>
                <Text style={styles.heroTag}>TOTAL OUTSTANDING DEBT BALANCE</Text>
                <View style={[styles.workdaysPill, totalDebtRemaining === 0 && { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Text style={styles.workdaysPillText}>
                    {overallPayoffPct}% Repaid
                  </Text>
                </View>
              </View>

              <Text className="fintech-mono" style={[styles.heroSalaryValue, totalDebtRemaining > 0 ? { color: '#f43f5e' } : { color: '#10b981' }]}>
                {formatPeso(totalDebtRemaining)}
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressLabelsRow}>
                  <Text style={styles.progressSubLabel}>Overall Payoff Progress</Text>
                  <Text className="fintech-mono" style={styles.progressPctLabel}>{overallPayoffPct}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <div
                    className="progress-bar-animated"
                    style={{
                      height: '100%',
                      backgroundColor: '#10b981',
                      borderRadius: 99,
                      width: `${Math.min(overallPayoffPct, 100)}%`
                    }}
                  />
                </View>
              </View>

              {/* 3 Metric Breakdown Boxes */}
              <View style={styles.debtHeroMetricsRow}>
                <View style={styles.miniMetricBox}>
                  <Text style={styles.miniMetricLabel}>Total Borrowed</Text>
                  <Text className="fintech-mono" style={styles.miniMetricValue}>
                    {formatPeso(totalDebtPrincipal)}
                  </Text>
                </View>
                <View style={styles.miniMetricBox}>
                  <Text style={styles.miniMetricLabel}>Total Repaid</Text>
                  <Text className="fintech-mono" style={[styles.miniMetricValue, { color: '#10b981' }]}>
                    {formatPeso(totalDebtPaid)}
                  </Text>
                </View>
                <View style={styles.miniMetricBox}>
                  <Text style={styles.miniMetricLabel}>Active Accounts</Text>
                  <Text className="fintech-mono" style={styles.miniMetricValue}>
                    {activeDebts.length} Active / {debts.length} Total
                  </Text>
                </View>
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.debtFilterRow}>
              <TouchableOpacity
                style={[styles.presetPill, debtFilter === 'ALL' ? styles.debtFilterActive : theme.inputBg]}
                onPress={() => setDebtFilter('ALL')}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetPillText, debtFilter === 'ALL' ? styles.debtFilterActiveText : theme.text]}>
                  All Debts ({debts.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetPill, debtFilter === 'ACTIVE' ? styles.debtFilterActive : theme.inputBg]}
                onPress={() => setDebtFilter('ACTIVE')}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetPillText, debtFilter === 'ACTIVE' ? styles.debtFilterActiveText : theme.text]}>
                  Active ({activeDebts.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetPill, debtFilter === 'SETTLED' ? styles.debtFilterActive : theme.inputBg]}
                onPress={() => setDebtFilter('SETTLED')}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetPillText, debtFilter === 'SETTLED' ? styles.debtFilterActiveText : theme.text]}>
                  Fully Paid ({settledDebts.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Debts List */}
            {filteredDebts.length === 0 ? (
              <View style={[styles.emptyStateBox, { paddingVertical: 40 }]}>
                <CreditCardIcon size={44} color={mutedIconColor} style={{ marginBottom: 10 }} />
                <Text style={[styles.emptyTitle, theme.text, { fontSize: 16 }]}>
                  {debts.length === 0 ? 'No Debts or Loans Recorded Yet' : 'No Debts Match the Selected Filter'}
                </Text>
                <Text style={[styles.emptySubtitle, theme.subtext, { maxWidth: 400, textAlign: 'center', marginTop: 4 }]}>
                  {debts.length === 0
                    ? 'Add a loan like a Motorcycle Loan (₱80,000) to start logging your installment payments and amortization.'
                    : 'Switch filters or add a new debt to view records.'}
                </Text>
                {debts.length === 0 && (
                  <TouchableOpacity
                    style={[styles.primaryAddBtn, { marginTop: 16, paddingHorizontal: 20 }]}
                    onPress={handleOpenAddDebt}
                    activeOpacity={0.85}
                  >
                    <PlusIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryAddBtnText}>+ Add First Debt / Loan</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={{ gap: 14 }}>
                {filteredDebts.map(debt => {
                  const paidAmt = (debt.payments || []).reduce((s, p) => s + p.amount, 0);
                  const remAmt = Math.max(0, debt.totalAmount - paidAmt);
                  const pct = debt.totalAmount > 0 ? Math.min(100, Math.round((paidAmt / debt.totalAmount) * 100)) : 0;
                  const isSettled = remAmt === 0 && debt.totalAmount > 0;
                  const catObj = DEBT_CATEGORIES.find(c => c.id === debt.category) || DEBT_CATEGORIES[0];
                  const isExpanded = !!expandedDebts[debt.id];

                  return (
                    <View key={debt.id} style={[styles.debtCardBox, theme.inputBg]}>
                      {/* Card Top Row */}
                      <View style={styles.debtCardHeader}>
                        <View style={styles.debtHeaderLeft}>
                          <View style={styles.debtCategoryEmojiBox}>
                            <Text style={{ fontSize: 20 }}>{catObj.icon}</Text>
                          </View>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <Text style={[styles.debtTitleText, theme.text]}>{debt.title}</Text>
                              <View style={[styles.categoryChip, theme.card, { paddingVertical: 2, paddingHorizontal: 6, margin: 0 }]}>
                                <Text style={[styles.categoryChipText, theme.subtext, { fontSize: 10 }]}>{catObj.label}</Text>
                              </View>
                            </View>
                            <Text style={[styles.debtSubDateText, theme.subtext]}>
                              Added: {debt.createdAt || 'N/A'} {debt.dueDate ? `• Target Due: ${debt.dueDate}` : ''}
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.debtStatusPill, isSettled ? styles.debtPillSettled : styles.debtPillActive]}>
                          {isSettled ? (
                            <CheckCircleIcon size={12} color="#10b981" style={{ marginRight: 4 }} />
                          ) : null}
                          <Text style={[styles.debtStatusPillText, isSettled ? styles.textSuccess : styles.debtStatusActiveText]}>
                            {isSettled ? 'FULLY PAID' : `${pct}% PAID`}
                          </Text>
                        </View>
                      </View>

                      {/* Remaining & Stats Row */}
                      <View style={[styles.debtInnerStatBox, theme.card]}>
                        <View style={styles.debtStatTop}>
                          <View>
                            <Text style={[styles.miniMetricLabel, theme.subtext]}>REMAINING BALANCE</Text>
                            <Text className="fintech-mono" style={[styles.debtMainRemainingValue, isSettled ? styles.textSuccess : { color: '#f43f5e' }]}>
                              {formatPeso(remAmt)}
                            </Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.miniMetricLabel, theme.subtext]}>TOTAL PRINCIPAL</Text>
                            <Text className="fintech-mono" style={[styles.miniMetricValue, theme.text, { fontSize: 15 }]}>
                              {formatPeso(debt.totalAmount)}
                            </Text>
                          </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressSection}>
                          <View style={styles.progressLabelsRow}>
                            <Text style={[styles.progressSubLabel, theme.subtext]}>
                              Repaid: {formatPeso(paidAmt)} ({pct}%)
                            </Text>
                            {debt.monthlyTarget > 0 && (
                              <Text style={[styles.progressSubLabel, theme.subtext]}>
                                Target: {formatPeso(debt.monthlyTarget)}/mo
                              </Text>
                            )}
                          </View>
                          <View style={styles.progressBarTrack}>
                            <div
                              className="progress-bar-animated"
                              style={{
                                height: '100%',
                                backgroundColor: isSettled ? '#10b981' : '#3b82f6',
                                borderRadius: 99,
                                width: `${Math.min(pct, 100)}%`
                              }}
                            />
                          </View>
                        </View>

                        {debt.notes ? (
                          <Text style={[styles.debtNotesText, theme.subtext]}>
                            📝 {debt.notes}
                          </Text>
                        ) : null}
                      </View>

                      {/* Action Buttons Row */}
                      <View style={styles.debtCardActions}>
                        <TouchableOpacity
                          style={styles.primaryAddBtn}
                          onPress={() => handleOpenPaymentModal(debt)}
                          activeOpacity={0.85}
                        >
                          <PlusIcon size={14} color="#ffffff" style={{ marginRight: 6 }} />
                          <Text style={styles.primaryAddBtnText}>+ Pay Installment / Fee</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.cancelBtn, theme.btnBg, { paddingHorizontal: 12 }]}
                          onPress={() => toggleExpandDebt(debt.id)}
                          activeOpacity={0.7}
                        >
                          <HistoryIcon size={14} color={iconColor} style={{ marginRight: 6 }} />
                          <Text style={[theme.text, { fontSize: 12, fontWeight: '700' }]}>
                            History ({debt.payments?.length || 0})
                          </Text>
                          {isExpanded ? (
                            <ChevronUpIcon size={13} color={iconColor} style={{ marginLeft: 4 }} />
                          ) : (
                            <ChevronDownIcon size={13} color={iconColor} style={{ marginLeft: 4 }} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.iconBtnAction, theme.btnBg]}
                          onPress={() => handleOpenEditDebt(debt)}
                          activeOpacity={0.6}
                        >
                          <EditIcon size={13} color={iconColor} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.iconBtnAction, theme.btnBg]}
                          onPress={() => promptDeleteDebt(debt)}
                          activeOpacity={0.6}
                        >
                          <TrashIcon size={13} color="#f43f5e" />
                        </TouchableOpacity>
                      </View>

                      {/* Expandable Payment History Table */}
                      {isExpanded && (
                        <View style={[styles.debtHistorySection, theme.card]}>
                          <View style={styles.debtHistoryHeaderRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <HistoryIcon size={14} color="#10b981" />
                              <Text style={[styles.debtHistoryTitle, theme.text]}>Installment Payment History</Text>
                            </View>
                            <Text style={[styles.breakdownMuted, theme.subtext]}>
                              Total Paid: {formatPeso(paidAmt)}
                            </Text>
                          </View>

                          {(debt.payments || []).length === 0 ? (
                            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                              <Text style={[styles.emptySubtitle, theme.subtext]}>
                                No installment payments logged yet. Tap "+ Pay Installment / Fee" above.
                              </Text>
                            </View>
                          ) : (
                            <View style={{ gap: 6 }}>
                              {debt.payments.map((p, idx) => (
                                <View key={p.id || idx} style={[styles.debtPaymentRow, theme.inputBg]}>
                                  <View style={styles.debtPaymentLeft}>
                                    <View style={styles.debtPaymentIconCircle}>
                                      <CheckIcon size={11} color="#10b981" />
                                    </View>
                                    <View>
                                      <Text style={[styles.debtPaymentNoteText, theme.text]}>
                                        {p.note || `Installment Payment`}
                                      </Text>
                                      <Text style={[styles.expDate, theme.subtext]}>
                                        {p.date}
                                      </Text>
                                    </View>
                                  </View>

                                  <View style={styles.debtPaymentRight}>
                                    <Text className="fintech-mono" style={[styles.debtPaymentAmtText, { color: '#10b981' }]}>
                                      +{formatPeso(p.amount)}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() => promptDeletePayment(debt, p)}
                                      style={[styles.iconBtnAction, theme.btnBg, { width: 28, height: 28 }]}
                                      activeOpacity={0.6}
                                    >
                                      <TrashIcon size={12} color="#f43f5e" />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        <Text style={[styles.fintechFooterText, theme.subtext]}>
          Enzo Soti &bull; Minimalist FinTech Budget Tracker Pro &bull; 100% Offline
        </Text>

      </ScrollView>

      {/* 1. RADIX UI DIALOG: QUICK-ADD EXPENSE MODAL */}
      <Dialog.Root open={showAddModal} onOpenChange={setShowAddModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusIcon size={18} color="#10b981" />
                <Dialog.Title style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Quick Log Expense
                </Dialog.Title>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>
            
            <Dialog.Description style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
              Record a purchase or payment to your daily budget.
            </Dialog.Description>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, theme.inputBg]}
                    onPress={() => handleSelectCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{cat.icon}</Text>
                    <Text style={[styles.categoryChipText, theme.text]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Expense Date</Text>
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
                placeholder="e.g. Lunch with team, Fuel, Coffee..."
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.amountHeaderRow}>
                <Text style={[styles.inputLabel, theme.subtext]}>Amount (₱)</Text>
                <View style={styles.chipsRow}>
                  {AMOUNT_CHIPS.map(chip => (
                    <TouchableOpacity
                      key={chip}
                      style={[styles.amountChip, theme.inputBg]}
                      onPress={() => handleAddAmountChip(chip)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.amountChipText}>+{chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                placeholder="0.00"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.modalActionsFlex}>
              <TouchableOpacity
                style={[styles.cancelBtn, theme.btnBg]}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.7}
              >
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAddBtn} onPress={() => handleAddExpense(true)} activeOpacity={0.85}>
                <CheckIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryAddBtnText}>Save Expense</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 2. RADIX UI DIALOG: CONFIRMATION MODAL */}
      <Dialog.Root open={!!confirmModal} onOpenChange={(open) => !open && setConfirmModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content radix-confirm-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <View style={[
              styles.confirmIconBubble,
              confirmModal?.isDanger ? styles.bubbleDanger : styles.bubblePrimary
            ]}>
              <AlertTriangleIcon size={24} color={confirmModal?.isDanger ? '#f43f5e' : '#10b981'} />
            </View>

            <Dialog.Title style={{ fontSize: 17, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', textAlign: 'center', margin: 0 }}>
              {confirmModal?.title || 'Confirm Action'}
            </Dialog.Title>

            <Dialog.Description style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#64748b', textAlign: 'center', lineHeight: '18px', margin: 0 }}>
              {confirmModal?.message || 'Are you sure you want to proceed?'}
            </Dialog.Description>

            <View style={styles.confirmModalBtnRow}>
              <TouchableOpacity
                style={[styles.confirmModalCancelBtn, theme.btnBg]}
                onPress={() => setConfirmModal(null)}
                activeOpacity={0.7}
              >
                <Text style={[styles.confirmModalCancelText, theme.text]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmModalActionBtn,
                  confirmModal?.isDanger ? styles.confirmBtnDanger : styles.confirmBtnSuccess
                ]}
                onPress={() => {
                  if (confirmModal?.onConfirm) confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmModalActionText}>
                  {confirmModal?.confirmLabel || 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 3. RADIX UI DIALOG: ATTENDANCE & TARDINESS SHEET WITH SPECIAL NON-WORKING HOLIDAY (NO PAY) */}
      <Dialog.Root open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarIcon size={18} color="#10b981" />
                <Dialog.Title style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Attendance & Tardiness Sheet
                </Dialog.Title>
              </div>
              <button
                type="button"
                onClick={() => setShowAttendanceModal(false)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <Dialog.Description style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
              Tap attendance status to cycle: Full Day (1.0x) → Half Day (0.5x) → Special Holiday (No Pay 0x) → Absent (0x) → Sunday Rest.
            </Dialog.Description>

            <View style={[styles.modalBanner, theme.inputBg]}>
              <Text style={[styles.modalBannerText, theme.text]}>
                Monthly Net: {formatPeso(parseFloat(monthlySalary) || 21000)} | Semi-Monthly Base: {formatPeso(userMonthly / 2)}{"\n"}
                Daily Rate: {formatPeso(dailyWorkRate)} | Hourly: {formatPeso(dailyWorkRate / 8)} | Late: {formatPeso(minuteRate)}/min
              </Text>
            </View>

            {totalTardyMinutes > 0 && (
              <View style={styles.warningAlertBox}>
                <ClockIcon size={15} color="#f59e0b" />
                <Text style={styles.warningAlertText}>
                  Total Tardiness: {totalTardyMinutes} mins (-{formatPeso(totalTardyDeduction)} deducted from cut-off pay).
                </Text>
              </View>
            )}

            <Text style={[styles.inputLabel, theme.subtext]}>
              Daily Cut-off Schedule (Tap badge to change status):
            </Text>

            <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={true}>
              {rangeDates.map(dateStr => {
                const status = getResolvedStatus(dateStr);
                const dayName = getDayNameStr(dateStr);
                const isWorkingDay = status !== 'REST_DAY' && status !== 'ABSENT' && status !== 'SPECIAL_HOLIDAY';
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
                        status === 'HALF' ? styles.statusPillHalf :
                        status === 'SPECIAL_HOLIDAY' ? styles.statusPillHoliday : styles.statusPillAbsent
                      ]}>
                        <Text style={[
                          styles.attStatusPillText,
                          status === 'SPECIAL_HOLIDAY' && styles.statusHolidayText
                        ]}>
                          {status === 'SAT_FULL' ? 'Sat (Full Pay)' :
                           status === 'FULL' ? 'Full Day (1.0x)' :
                           status === 'HALF' ? 'Half Day (0.5x)' :
                           status === 'SPECIAL_HOLIDAY' ? 'Special Holiday (0x)' :
                           status === 'REST_DAY' ? 'Sunday Rest' : 'Absent (0x)'}
                        </Text>
                      </View>
                    </TouchableOpacity>

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
                              newTardyMap[dateStr] = Math.min(480, num);
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

            <TouchableOpacity
              style={styles.primaryAddBtn}
              onPress={() => setShowAttendanceModal(false)}
              activeOpacity={0.85}
            >
              <CheckIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.primaryAddBtnText}>Save & Close Sheet</Text>
            </TouchableOpacity>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 4. RADIX UI DIALOG: EDIT EXPENSE MODAL */}
      <Dialog.Root open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Dialog.Title style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                Edit Expense Record
              </Dialog.Title>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <Dialog.Description style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
              Update description, amount, or date for this logged expense.
            </Dialog.Description>

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
              <TouchableOpacity
                style={[styles.cancelBtn, theme.btnBg]}
                onPress={() => setEditItem(null)}
                activeOpacity={0.7}
              >
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAddBtn} onPress={handleSaveEdit} activeOpacity={0.85}>
                <Text style={styles.primaryAddBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 5. RADIX UI DIALOG: ADD NEW DEBT MODAL */}
      <Dialog.Root open={showAddDebtModal} onOpenChange={setShowAddDebtModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCardIcon size={18} color="#10b981" />
                <Dialog.Title style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Record New Debt / Loan
                </Dialog.Title>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDebtModal(false)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <Dialog.Description style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
              Add a loan or debt (e.g. Motorcycle ₱80k, Personal, Gadgets) to track installments.
            </Dialog.Description>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                {DEBT_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, debtCategory === cat.id ? { backgroundColor: '#10b981' } : theme.inputBg]}
                    onPress={() => setDebtCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{cat.icon}</Text>
                    <Text style={[styles.categoryChipText, debtCategory === cat.id ? { color: '#ffffff', fontWeight: '800' } : theme.text]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Debt / Loan Name *</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                placeholder="e.g. Motorcycle Loan, Laptop Installment, Credit Card..."
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                value={debtTitle}
                onChangeText={setDebtTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Total Principal Amount (₱) *</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                placeholder="e.g. 80000"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                keyboardType="numeric"
                value={debtAmount}
                onChangeText={setDebtAmount}
              />
            </View>

            <View style={styles.twoColumnGrid}>
              <View style={styles.gridColumn}>
                <Text style={[styles.inputLabel, theme.subtext]}>Monthly Target (₱) (Optional)</Text>
                <TextInput
                  style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                  placeholder="e.g. 3500"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  keyboardType="numeric"
                  value={debtMonthlyTarget}
                  onChangeText={setDebtMonthlyTarget}
                />
              </View>

              <View style={styles.gridColumn}>
                <Text style={[styles.inputLabel, theme.subtext]}>Target Due Date (Optional)</Text>
                <input
                  type="date"
                  className={dateInputClassName}
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Notes / Terms (Optional)</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                placeholder="e.g. 24 months to pay, due every 15th"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                value={debtNotes}
                onChangeText={setDebtNotes}
              />
            </View>

            <View style={styles.modalActionsFlex}>
              <TouchableOpacity
                style={[styles.cancelBtn, theme.btnBg]}
                onPress={() => setShowAddDebtModal(false)}
                activeOpacity={0.7}
              >
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAddBtn} onPress={handleCreateDebt} activeOpacity={0.85}>
                <CheckIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryAddBtnText}>Save Debt Record</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 6. RADIX UI DIALOG: EDIT DEBT MODAL */}
      <Dialog.Root open={!!editDebtItem} onOpenChange={(open) => !open && setEditDebtItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Dialog.Title style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                Edit Debt / Loan Record
              </Dialog.Title>
              <button
                type="button"
                onClick={() => setEditDebtItem(null)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <Dialog.Description style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
              Update title, principal total, target installment, or notes.
            </Dialog.Description>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                {DEBT_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, debtCategory === cat.id ? { backgroundColor: '#10b981' } : theme.inputBg]}
                    onPress={() => setDebtCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{cat.icon}</Text>
                    <Text style={[styles.categoryChipText, debtCategory === cat.id ? { color: '#ffffff', fontWeight: '800' } : theme.text]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Debt / Loan Name</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                value={debtTitle}
                onChangeText={setDebtTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Total Principal Amount (₱)</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                value={debtAmount}
                onChangeText={setDebtAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.twoColumnGrid}>
              <View style={styles.gridColumn}>
                <Text style={[styles.inputLabel, theme.subtext]}>Monthly Target (₱)</Text>
                <TextInput
                  style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                  value={debtMonthlyTarget}
                  onChangeText={setDebtMonthlyTarget}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.gridColumn}>
                <Text style={[styles.inputLabel, theme.subtext]}>Target Due Date</Text>
                <input
                  type="date"
                  className={dateInputClassName}
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Notes / Terms</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                value={debtNotes}
                onChangeText={setDebtNotes}
              />
            </View>

            <View style={styles.modalActionsFlex}>
              <TouchableOpacity
                style={[styles.cancelBtn, theme.btnBg]}
                onPress={() => setEditDebtItem(null)}
                activeOpacity={0.7}
              >
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAddBtn} onPress={handleSaveEditDebt} activeOpacity={0.85}>
                <Text style={styles.primaryAddBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 7. RADIX UI DIALOG: RECORD INSTALLMENT / FEE MODAL */}
      <Dialog.Root open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content ${!isDark ? 'light-mode-dialog' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusIcon size={18} color="#10b981" />
                <Dialog.Title style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                  Record Installment / Fee Payment
                </Dialog.Title>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            {selectedDebtForPayment && (
              <View style={[styles.modalBanner, theme.inputBg]}>
                <Text style={[styles.modalBannerText, theme.text]}>
                  Recording payment for <Text style={{ fontWeight: '800', color: '#10b981' }}>{selectedDebtForPayment.title}</Text>{"\n"}
                  Current Remaining: <Text style={{ fontWeight: '800', color: '#f43f5e' }}>{formatPeso(Math.max(0, selectedDebtForPayment.totalAmount - (selectedDebtForPayment.payments || []).reduce((s, p) => s + p.amount, 0)))}</Text>
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Payment Date</Text>
              <input
                type="date"
                className={dateInputClassName}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, theme.subtext]}>Payment / Installment Note</Text>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                placeholder="e.g. Monthly Amortization #1, Downpayment, Fee..."
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                value={paymentNote}
                onChangeText={setPaymentNote}
              />
            </View>

            {/* Amount with Quick Chips */}
            <View style={styles.inputGroup}>
              <View style={styles.amountHeaderRow}>
                <Text style={[styles.inputLabel, theme.subtext]}>Payment Amount (₱)</Text>
                <View style={styles.chipsRow}>
                  {DEBT_PAYMENT_CHIPS.map(chip => (
                    <TouchableOpacity
                      key={chip}
                      style={[styles.amountChip, theme.inputBg]}
                      onPress={() => handleAddPaymentChip(chip)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.amountChipText}>+{chip >= 1000 ? `${chip / 1000}k` : chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={[styles.fintechTextInput, theme.inputBg, theme.text]}
                placeholder="0.00"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />
            </View>

            {/* Sync with Expenses Option */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setSyncWithExpenses(!syncWithExpenses)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkboxBox, syncWithExpenses && styles.checkboxBoxChecked]}>
                {syncWithExpenses && <CheckIcon size={12} color="#ffffff" />}
              </View>
              <Text style={[styles.checkboxLabel, theme.text]}>
                Also log as an expense in Daily Budget for {paymentDate}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActionsFlex}>
              <TouchableOpacity
                style={[styles.cancelBtn, theme.btnBg]}
                onPress={() => setShowPaymentModal(false)}
                activeOpacity={0.7}
              >
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAddBtn} onPress={handleRecordPayment} activeOpacity={0.85}>
                <CheckIcon size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryAddBtnText}>Save Payment</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 8. RADIX UI DIALOG: CUT-OFF PAYSLIP & SUMMARY REPORT MODAL */}
      <Dialog.Root open={showReportModal} onOpenChange={setShowReportModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog-overlay" />
          <Dialog.Content className={`radix-dialog-content printable-payslip ${!isDark ? 'light-mode-dialog' : ''}`} style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextIcon size={20} color="#10b981" />
                <div>
                  <Dialog.Title style={{ fontSize: 17, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
                    Cut-off Financial Statement & Payslip
                  </Dialog.Title>
                  <Dialog.Description style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>
                    Statement Period: {cutoffStart} to {cutoffEnd}
                  </Dialog.Description>
                </div>
              </div>
              <button
                type="button"
                className="no-print"
                onClick={() => setShowReportModal(false)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Payslip Header Card */}
            <View style={[styles.salaryHeroBanner, theme.heroSalaryBg, { padding: 14, gap: 10 }]}>
              <View style={styles.heroBannerHeader}>
                <Text style={styles.heroTag}>PAYSLIP SUMMARY</Text>
                <View style={styles.workdaysPill}>
                  <Text style={styles.workdaysPillText}>
                    {totalAttendedDays} Workdays
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                <View>
                  <Text style={[styles.inputLabel, theme.subtext]}>Net Take-Home Pay</Text>
                  <Text className="fintech-mono" style={[styles.heroSalaryValue, { fontSize: 24 }]}>
                    {formatPeso(calculatedCutoffSalary)}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  {additionalPayoutAmount > 0 && (
                    <Text style={{ color: '#10b981', fontWeight: '800', fontSize: 12 }}>
                      + Finance Addition: +{formatPeso(additionalPayoutAmount)}
                    </Text>
                  )}
                  {totalTardyDeduction > 0 && (
                    <Text style={[styles.breakdownTardy, { fontSize: 12 }]}>
                      Tardiness: -{formatPeso(totalTardyDeduction)}
                    </Text>
                  )}
                  <Text style={[styles.breakdownMuted, { fontSize: 11 }]}>
                    Base: {formatPeso(baseCutoffPay)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Financial Health Summary Metric Boxes */}
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <View style={[styles.miniMetricBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#f1f5f9' }]}>
                <Text style={[styles.miniMetricLabel, theme.subtext]}>Total Cut-off Expenses</Text>
                <Text className="fintech-mono" style={[styles.miniMetricValue, { color: '#f43f5e', fontSize: 16 }]}>
                  -{formatPeso(cutoffExpensesTotal)}
                </Text>
              </View>
              <View style={[styles.miniMetricBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#f1f5f9' }]}>
                <Text style={[styles.miniMetricLabel, theme.subtext]}>Loan Payments in Cut-off</Text>
                <Text className="fintech-mono" style={[styles.miniMetricValue, { color: '#f59e0b', fontSize: 16 }]}>
                  {formatPeso(cutoffDebtsTotal)}
                </Text>
              </View>
              <View style={[styles.miniMetricBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#f1f5f9' }]}>
                <Text style={[styles.miniMetricLabel, theme.subtext]}>Net Free Cash Remaining</Text>
                <Text className="fintech-mono" style={[styles.miniMetricValue, { color: cutoffNetFreeCash >= 0 ? '#10b981' : '#f43f5e', fontSize: 16 }]}>
                  {formatPeso(cutoffNetFreeCash)}
                </Text>
              </View>
            </View>

            {/* Category Breakdown in Statement */}
            <View style={[styles.fintechCard, theme.inputBg, { padding: 12, gap: 8 }]}>
              <Text style={[styles.cardTitle, theme.text, { fontSize: 13 }]}>Top Spending Breakdown</Text>
              {categoryBreakdown.length === 0 ? (
                <Text style={[styles.emptySubtitle, theme.subtext]}>No expenses logged during this cut-off period.</Text>
              ) : (
                categoryBreakdown.map(cat => (
                  <View key={cat.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
                      <Text style={[{ fontSize: 12, fontWeight: '600' }, theme.text]}>{cat.label}</Text>
                    </View>
                    <Text className="fintech-mono" style={[{ fontSize: 12, fontWeight: '700' }, theme.text]}>
                      {formatPeso(cat.total)} ({cat.pct}%)
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* Statement Actions */}
            <View style={[styles.modalActionsFlex, { justifyContent: 'space-between' }]}>
              <TouchableOpacity
                style={[styles.exportBtn, { minWidth: 140 }]}
                onPress={() => window.print()}
                activeOpacity={0.85}
              >
                <PrinterIcon size={15} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.exportBtnText}>Print / Save PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, theme.btnBg, { minWidth: 90 }]}
                onPress={() => setShowReportModal(false)}
                activeOpacity={0.7}
              >
                <Text style={theme.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },

  /* Floating Action Button (FAB) */
  floatingActionBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9980,
    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
  },

  /* Floating Toast Alert */
  toastPopup: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
    maxWidth: '90%',
  },
  toastSuccess: {
    backgroundColor: '#059669',
  },
  toastWarning: {
    backgroundColor: '#d97706',
  },
  toastError: {
    backgroundColor: '#e11d48',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  /* Custom Confirmation Modal Styles */
  confirmIconBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    alignSelf: 'center',
  },
  bubbleDanger: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
  },
  bubblePrimary: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  confirmModalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  confirmModalCancelBtn: {
    flex: 1,
    minWidth: 100,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmModalCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmModalActionBtn: {
    flex: 1.2,
    minWidth: 120,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
  },
  confirmBtnDanger: {
    backgroundColor: '#f43f5e',
    boxShadow: '0 3px 6px rgba(244, 63, 94, 0.3)',
  },
  confirmBtnSuccess: {
    backgroundColor: '#10b981',
    boxShadow: '0 3px 6px rgba(16, 185, 129, 0.3)',
  },
  confirmModalActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  /* FinTech Brand Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    gap: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
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
    flexShrink: 0,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    flexWrap: 'wrap',
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
    flexShrink: 0,
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
  tabScrollWrapper: {
    width: '100%',
    maxHeight: 52,
  },
  segmentedTabBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 4,
    alignItems: 'center',
    minWidth: '100%',
  },
  segmentTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    flexShrink: 0,
  },
  segmentTabActive: {
    backgroundColor: '#10b981',
    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)',
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
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
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
    flex: 1,
    minWidth: 180,
    flexWrap: 'wrap',
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
    flexShrink: 0,
  },
  attendanceBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  /* 1-Tap Presets */
  presetSection: {
    gap: 8,
  },
  presetPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Categories & Quick Chips */
  categoryScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  amountChip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  amountChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981',
  },

  /* Alert Banners */
  dangerAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    padding: 10,
    borderRadius: 10,
  },
  dangerAlertText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f43f5e',
    flex: 1,
  },
  warningAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 10,
    borderRadius: 10,
  },
  warningAlertText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    flex: 1,
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
    boxSizing: 'border-box',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  gridColumn: {
    flex: 1,
    minWidth: 140,
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
    boxShadow: '0 3px 8px rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 16,
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
    flexWrap: 'wrap',
    gap: 6,
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
    flexShrink: 0,
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
    flexWrap: 'wrap',
    gap: 6,
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
    flexWrap: 'wrap',
  },
  miniMetricBox: {
    flex: 1,
    minWidth: 105,
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
    flexWrap: 'wrap',
    gap: 4,
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
    gap: 10,
  },
  expenseLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  expenseTagIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  expenseDetails: {
    flex: 1,
    minWidth: 0,
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
    flexShrink: 0,
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
    flexWrap: 'wrap',
  },
  exportBtn: {
    flex: 1,
    minWidth: 120,
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
    minWidth: 120,
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
    flexWrap: 'wrap',
  },
  attHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    minWidth: 140,
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
  statusPillHoliday: { backgroundColor: 'rgba(168, 85, 247, 0.2)' },
  statusPillAbsent: { backgroundColor: 'rgba(244, 63, 94, 0.18)' },
  attStatusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  statusHolidayText: {
    color: '#d8b4fe',
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
    flexWrap: 'wrap',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  fintechFooterText: {
    textAlign: 'center',
    fontSize: 11,
    marginVertical: 10,
  },

  /* Debts & Loans Components */
  debtOverviewBanner: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  debtOverviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
  },
  debtTotalRemainingText: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  debtPayoffBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  debtPayoffBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981',
  },
  debtOverviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  debtMiniItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  debtMiniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  debtMiniPayBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  debtMiniPayBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  debtManagerHeroBanner: {
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  debtHeroMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  debtFilterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  debtFilterActive: {
    backgroundColor: '#10b981',
  },
  debtFilterActiveText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  debtCardBox: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 12,
  },
  debtCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
  },
  debtHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 160,
    flexWrap: 'wrap',
  },
  debtCategoryEmojiBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  debtTitleText: {
    fontSize: 16,
    fontWeight: '800',
    flexShrink: 1,
  },
  debtSubDateText: {
    fontSize: 11,
    marginTop: 2,
  },
  debtStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  debtPillActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  debtPillSettled: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  debtStatusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  debtStatusActiveText: {
    color: '#f59e0b',
  },
  debtInnerStatBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  debtStatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
  },
  debtMainRemainingValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  debtNotesText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  debtCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  debtHistorySection: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
    marginTop: 4,
  },
  debtHistoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  debtHistoryTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  debtPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  debtPaymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  debtPaymentIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  debtPaymentNoteText: {
    fontSize: 12,
    fontWeight: '700',
  },
  debtPaymentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  debtPaymentAmtText: {
    fontSize: 13,
    fontWeight: '800',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    cursor: 'pointer',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  checkboxBoxChecked: {
    backgroundColor: '#10b981',
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  /* Financial Calendar Heatmap */
  calendarLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    paddingVertical: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
  },
  calendarGridWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  calendarDayHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
  },
  textDanger: {
    color: '#f43f5e',
  },
  textSuccess: {
    color: '#10b981',
  }
});

// Curated Minimalist FinTech Palette
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
