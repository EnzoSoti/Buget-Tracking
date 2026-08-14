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

const CATEGORIES = {
  Food: { label: 'Food & Groceries', emoji: '🍚' },
  Bills: { label: 'Bills & Utilities', emoji: '⚡' },
  Transport: { label: 'Transportation', emoji: '🚌' },
  Housing: { label: 'Rent & Housing', emoji: '🏠' },
  Health: { label: 'Health & Medical', emoji: '🏥' },
  Shopping: { label: 'Shopping', emoji: '🛍️' },
  Entertainment: { label: 'Entertainment', emoji: '🎮' },
  Others: { label: 'Others', emoji: '💡' }
};

const getTodayString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [salary, setSalary] = useState(11153.80);
  const [salaryInputVal, setSalaryInputVal] = useState('11153.80');
  const [expenses, setExpenses] = useState([]);
  
  // Date Selection
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [filterCat, setFilterCat] = useState('ALL');
  
  // Theme
  const [isDark, setIsDark] = useState(true);

  // Edit Modal
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('Food');
  const [editDate, setEditDate] = useState(getTodayString());

  // Load Saved Data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rn_salary_budget_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.salary === 'number') {
          setSalary(parsed.salary);
          setSalaryInputVal(parsed.salary.toString());
        }
        if (Array.isArray(parsed.expenses)) {
          setExpenses(parsed.expenses);
        }
        if (typeof parsed.isDark === 'boolean') {
          setIsDark(parsed.isDark);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save Data
  const saveData = (newSalary, newExpenses, newIsDark) => {
    try {
      localStorage.setItem('rn_salary_budget_data', JSON.stringify({
        salary: newSalary,
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

  // Date Nav
  const changeDateByDays = (days) => {
    const parts = selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + days);
    const newStr = getTodayString(current);
    setSelectedDate(newStr);
    setExpenseDate(newStr);
  };

  // Save Salary
  const handleUpdateSalary = () => {
    const val = parseFloat(salaryInputVal);
    if (!isNaN(val) && val >= 0) {
      setSalary(val);
      saveData(val, expenses, isDark);
    }
  };

  // Add Expense
  const handleAddExpense = () => {
    const amt = parseFloat(amount);
    if (!name.trim() || isNaN(amt) || amt <= 0) return;

    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: amt,
      category: category,
      date: expenseDate || selectedDate
    };

    const updated = [newItem, ...expenses];
    setExpenses(updated);
    saveData(salary, updated, isDark);

    setName('');
    setAmount('');
  };

  // Preset Click
  const handlePreset = (presetName, presetCat) => {
    setName(presetName);
    if (presetCat) setCategory(presetCat);
  };

  // Delete
  const handleDelete = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    saveData(salary, updated, isDark);
  };

  // Open Edit
  const openEdit = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category || 'Food');
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
          category: editCategory,
          date: editDate
        };
      }
      return exp;
    });

    setExpenses(updated);
    saveData(salary, updated, isDark);
    setEditItem(null);
  };

  // Clear All
  const handleClearAll = () => {
    if (expenses.length === 0) return;
    if (confirm('Clear all recorded expenses?')) {
      setExpenses([]);
      saveData(salary, [], isDark);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    let csv = "Date,Expense Description,Category,Amount (PHP)\n";
    expenses.forEach(exp => {
      csv += `"${exp.date || ''}","${exp.name.replace(/"/g, '""')}","${exp.category}",${exp.amount}\n`;
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
    saveData(salary, expenses, next);
  };

  // Calculations
  const dateExpenses = expenses.filter(exp => exp.date === selectedDate);
  const totalDateExpenses = dateExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalAllExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = salary - totalAllExpenses;
  const spentPct = salary > 0 ? Math.min(Math.round((totalAllExpenses / salary) * 100), 999) : 0;

  const filteredExpenses = filterCat === 'ALL'
    ? dateExpenses
    : dateExpenses.filter(exp => exp.category === filterCat);

  const theme = isDark ? darkTheme : lightTheme;

  // Simple Clean Input Styles
  const dateInputStyle = {
    flex: '1 1 130px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '44px',
    cursor: 'pointer'
  };

  const selectStyle = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '44px',
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
            <Text style={[styles.mainSubtitle, theme.subtext]}>Salary & Expense Manager</Text>
          </View>
          <TouchableOpacity style={[styles.themePill, theme.card]} onPress={toggleTheme}>
            <Text style={styles.themeEmoji}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </TouchableOpacity>
        </View>

        {/* Simple Date Filter Row */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>SELECT DATE</Text>
          <View style={styles.dateControlRow}>
            <TouchableOpacity style={[styles.dateNavBtn, theme.btnBg]} onPress={() => changeDateByDays(-1)}>
              <Text style={[styles.dateNavBtnText, theme.text]}>◀ Prev</Text>
            </TouchableOpacity>

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
          remaining < 0 || spentPct > 90 ? styles.cardDanger :
          spentPct >= 75 ? styles.cardWarning : styles.cardSuccess
        ]}>
          <Text style={styles.balanceTag}>REMAINING BALANCE</Text>
          <Text style={styles.balanceBigNumber}>{formatPeso(remaining)}</Text>

          <View style={styles.balanceMiniRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Total Salary</Text>
              <Text style={styles.miniValue}>{formatPeso(salary)}</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniLabel}>Spent on {selectedDate}</Text>
              <Text style={styles.miniValue}>{formatPeso(totalDateExpenses)}</Text>
            </View>
          </View>

          {/* Simple Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Spent Ratio ({spentPct}%)</Text>
              <Text style={styles.progressLabel}>
                {remaining < 0 || spentPct > 90 ? 'Critical' : spentPct >= 75 ? 'Caution' : 'Healthy'}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${Math.min(spentPct, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Salary Input Card */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>SET MONTHLY SALARY</Text>
          <View style={[styles.inputBox, theme.btnBg]}>
            <Text style={styles.pesoSymbol}>₱</Text>
            <TextInput
              style={[styles.salaryTextInput, theme.text]}
              value={salaryInputVal}
              onChangeText={setSalaryInputVal}
              keyboardType="numeric"
              placeholder="11153.80"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            />
            <TouchableOpacity style={styles.actionSaveBtn} onPress={handleUpdateSalary}>
              <Text style={styles.actionSaveText}>Set Salary</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Expense Form */}
        <View style={[styles.simpleCard, theme.card]}>
          <Text style={[styles.sectionLabel, theme.subtext]}>ADD NEW EXPENSE</Text>

          {/* Date Selector for Expense */}
          <View style={styles.formFieldGroup}>
            <Text style={[styles.fieldTitle, theme.subtext]}>Date</Text>
            <input
              type="date"
              style={dateInputStyle}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </View>

          {/* Presets */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScrollView}>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => handlePreset('Rice & Groceries', 'Food')}>
              <Text style={theme.text}>🍚 Rice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => handlePreset('Electric Bill', 'Bills')}>
              <Text style={theme.text}>⚡ Electricity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => handlePreset('Water Bill', 'Bills')}>
              <Text style={theme.text}>💧 Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => handlePreset('Internet', 'Bills')}>
              <Text style={theme.text}>🌐 Internet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => handlePreset('Transpo', 'Transport')}>
              <Text style={theme.text}>🚌 Transpo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.presetChip, theme.btnBg]} onPress={() => handlePreset('Rent', 'Housing')}>
              <Text style={theme.text}>🏠 Rent</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Inputs */}
          <View style={styles.formFieldGroup}>
            <Text style={[styles.fieldTitle, theme.subtext]}>Expense Description</Text>
            <TextInput
              style={[styles.textInputFull, theme.btnBg, theme.text]}
              placeholder="e.g. Rice, Electric Bill..."
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.twoColumnGrid}>
            <View style={styles.gridColumn}>
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

            <View style={styles.gridColumn}>
              <Text style={[styles.fieldTitle, theme.subtext]}>Category</Text>
              <select
                style={selectStyle}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.keys(CATEGORIES).map(key => (
                  <option key={key} value={key}>
                    {CATEGORIES[key].emoji} {CATEGORIES[key].label}
                  </option>
                ))}
              </select>
            </View>
          </View>

          <TouchableOpacity style={styles.addExpenseBtn} onPress={handleAddExpense}>
            <Text style={styles.addExpenseBtnText}>+ Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Expenses List Card */}
        <View style={[styles.simpleCard, theme.card]}>
          <View style={styles.listHeaderFlex}>
            <Text style={[styles.sectionLabel, theme.subtext]}>RECORDS FOR {selectedDate}</Text>
            <select
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f8fafc' : '#0f172a',
                border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                outline: 'none',
                cursor: 'pointer'
              }}
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {Object.keys(CATEGORIES).map(key => (
                <option key={key} value={key}>
                  {CATEGORIES[key].emoji} {CATEGORIES[key].label}
                </option>
              ))}
            </select>
          </View>

          {filteredExpenses.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyBoxText, theme.subtext]}>No expenses for {selectedDate}</Text>
            </View>
          ) : (
            filteredExpenses.map(item => {
              const catInfo = CATEGORIES[item.category] || CATEGORIES.Others;
              return (
                <View key={item.id} style={[styles.expenseRow, theme.btnBg]}>
                  <View style={styles.expenseRowLeft}>
                    <Text style={styles.catEmoji}>{catInfo.emoji}</Text>
                    <View style={styles.expenseTextInfo}>
                      <Text style={[styles.expNameText, theme.text]}>{item.name}</Text>
                      <Text style={[styles.expDateText, theme.subtext]}>{catInfo.label} &bull; {item.date}</Text>
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
              );
            })
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

        <Text style={[styles.pageFooterText, theme.subtext]}>Salary Budget Tracker &bull; 100% Mobile Responsive</Text>

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
              style={dateInputStyle}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <Text style={[styles.fieldTitle, theme.subtext]}>Description</Text>
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

            <Text style={[styles.fieldTitle, theme.subtext]}>Category</Text>
            <select
              style={selectStyle}
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              {Object.keys(CATEGORIES).map(key => (
                <option key={key} value={key}>
                  {CATEGORIES[key].emoji} {CATEGORIES[key].label}
                </option>
              ))}
            </select>

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

// Clean Minimalist Responsive Styles
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
  dateControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  dateNavBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 44,
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
  presetsScrollView: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
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

  /* Expense List */
  listHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
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
    fontSize: 24,
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

// Theme Definitions
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
