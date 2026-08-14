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

export default function App() {
  // Map of Date -> Income Amount (e.g. { "2026-08-14": 11153.80 })
  const [dailySalaries, setDailySalaries] = useState({});
  const [expenses, setExpenses] = useState([]);
  
  // Date Selection State
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Income Input State for currently selected date
  const [salaryInputVal, setSalaryInputVal] = useState('11153.80');
  
  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Theme
  const [isDark, setIsDark] = useState(true);

  // Edit Modal
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
        } else if (typeof parsed.salary === 'number') {
          // Migration fallback
          setDailySalaries({ [getTodayString()]: parsed.salary });
        }
        if (Array.isArray(parsed.expenses)) {
          setExpenses(parsed.expenses);
        }
        if (typeof parsed.isDark === 'boolean') {
          setIsDark(parsed.isDark);
        }
      } else {
        // Default initial salary for today
        const initialMap = { [getTodayString()]: 11153.80 };
        setDailySalaries(initialMap);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update Salary Input when Selected Date Changes
  useEffect(() => {
    const currentInc = dailySalaries[selectedDate] ?? (selectedDate === getTodayString() ? 11153.80 : 0);
    setSalaryInputVal(currentInc > 0 ? currentInc.toString() : '');
  }, [selectedDate, dailySalaries]);

  // Save Data
  const saveData = (newDailySalaries, newExpenses, newIsDark) => {
    try {
      localStorage.setItem('rn_daily_budget_data', JSON.stringify({
        dailySalaries: newDailySalaries,
        expenses: newExpenses,
        isDark: newIsDark
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

  // Date Navigation
  const changeDateByDays = (days) => {
    const parts = selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + days);
    const newStr = getTodayString(current);
    setSelectedDate(newStr);
    setExpenseDate(newStr);
  };

  // Save Income for Currently Selected Date
  const handleUpdateSalary = () => {
    const val = parseFloat(salaryInputVal);
    const validVal = (!isNaN(val) && val >= 0) ? val : 0;
    
    const updatedSalaries = {
      ...dailySalaries,
      [selectedDate]: validVal
    };

    setDailySalaries(updatedSalaries);
    saveData(updatedSalaries, expenses, isDark);
  };

  // Add Expense for Selected Date
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

  // Open Edit
  const openEdit = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditDate(item.date || selectedDate);
  };

  // Save Edit
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
    if (confirm(`Clear all recorded expenses?`)) {
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

  // Current Selected Date's Income & Expenses
  const currentDateSalary = dailySalaries[selectedDate] ?? (selectedDate === getTodayString() ? 11153.80 : 0);
  const dateExpenses = expenses.filter(exp => exp.date === selectedDate);
  const totalDateExpenses = dateExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  // Remaining Balance for Selected Date
  const remainingForDate = currentDateSalary - totalDateExpenses;
  const spentPctForDate = currentDateSalary > 0 ? Math.min(Math.round((totalDateExpenses / currentDateSalary) * 100), 999) : 0;

  const theme = isDark ? darkTheme : lightTheme;

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

  const navDateInputStyle = {
    flex: '1 1 120px',
    maxWidth: '180px',
    boxSizing: 'border-box',
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
            <Text style={[styles.mainSubtitle, theme.subtext]}>Daily Income & Expense Manager</Text>
          </View>
          <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme}>
            <Text style={styles.themeEmoji}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </TouchableOpacity>
        </View>

        {/* Date Filter Row */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>SELECT DATE</Text>
          <View style={styles.dateControlRow}>
            <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(-1)}>
              <Text style={[styles.dateNavBtnText, theme.text]}>◀ Prev</Text>
            </TouchableOpacity>

            <input
              type="date"
              style={navDateInputStyle}
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

        {/* Primary Remaining Balance Highlight Card for Selected Date */}
        <View style={[
          styles.mainBalanceCard,
          remainingForDate < 0 || spentPctForDate > 90 ? styles.cardDanger :
          spentPctForDate >= 75 ? styles.cardWarning : styles.cardSuccess
        ]}>
          <Text style={styles.balanceTag}>REMAINING BALANCE ({selectedDate})</Text>
          <Text style={styles.balanceBigNumber}>{formatPeso(remainingForDate)}</Text>

          <View style={styles.balanceMiniRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Income ({selectedDate})</Text>
              <Text style={styles.miniValue}>{formatPeso(currentDateSalary)}</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Expenses ({selectedDate})</Text>
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

        {/* Income / Salary Input Card FOR THE SELECTED DATE */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>SET INCOME FOR {selectedDate}</Text>
          <View style={[styles.inputBox, theme.btnBg]}>
            <Text style={styles.pesoSymbol}>₱</Text>
            <TextInput
              style={[styles.salaryTextInput, theme.text]}
              value={salaryInputVal}
              onChangeText={setSalaryInputVal}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            />
            <TouchableOpacity style={styles.actionSaveBtn} onPress={handleUpdateSalary}>
              <Text style={styles.actionSaveText}>Save</Text>
            </TouchableOpacity>
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

        <Text style={[styles.pageFooterText, theme.subtext]}>Salary Budget Tracker &bull; Per-Date Income Records</Text>

      </ScrollView>

      {/* Edit Modal */}
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

  /* Salary Input */
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 48,
  },
  pesoSymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
    marginRight: 6,
  },
  salaryTextInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    outlineStyle: 'none',
  },
  actionSaveBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionSaveText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
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
    maxWidth: 420,
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
