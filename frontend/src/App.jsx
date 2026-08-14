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

// Helper: Get YYYY-MM-DD string
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
  
  // Date Selection State
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  
  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [filterCat, setFilterCat] = useState('ALL');
  
  // Theme State
  const [isDark, setIsDark] = useState(true);

  // Edit Modal State
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

  // Date Navigation (Prev Day / Next Day)
  const changeDateByDays = (days) => {
    const parts = selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + days);
    const newStr = getTodayString(current);
    setSelectedDate(newStr);
    setExpenseDate(newStr);
  };

  // Update Salary
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

  // Preset Chip Click
  const handlePreset = (presetName, presetCat) => {
    setName(presetName);
    if (presetCat) setCategory(presetCat);
  };

  // Delete Expense
  const handleDelete = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    saveData(salary, updated, isDark);
  };

  // Open Edit Modal
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
    if (confirm('Clear all expenses?')) {
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

  // Filter Expenses by Selected Date
  const dateExpenses = expenses.filter(exp => exp.date === selectedDate);
  const totalDateExpenses = dateExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Overall Total Expenses
  const totalAllExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = salary - totalAllExpenses;
  const spentPct = salary > 0 ? Math.min(Math.round((totalAllExpenses / salary) * 100), 999) : 0;

  // Filter Category within selected Date
  const filteredExpenses = filterCat === 'ALL'
    ? dateExpenses
    : dateExpenses.filter(exp => exp.category === filterCat);

  // Dynamic Theme Colors
  const theme = isDark ? darkTheme : lightTheme;

  // Date input inline style for full responsiveness
  const responsiveDateInputStyle = {
    flex: '1 1 140px',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1.5px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '44px',
    cursor: 'pointer'
  };

  const responsiveSelectStyle = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1.5px solid ${isDark ? '#334155' : '#cbd5e1'}`,
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
        <View style={[styles.card, theme.card, styles.headerRow]}>
          <View style={styles.brandRow}>
            <Text style={styles.logoEmoji}>💰</Text>
            <View style={styles.titleWrapper}>
              <Text style={[styles.title, theme.text]}>Salary Budget Tracker</Text>
              <Text style={[styles.subtitle, theme.subtext]}>Super Responsive &bull; React Native</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.themeBtn, theme.themeBtn]} onPress={toggleTheme}>
            <Text style={styles.themeBtnText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Super Responsive Date Selector Card */}
        <View style={[styles.card, theme.card]}>
          <Text style={[styles.cardHeader, theme.text]}>📅 Select Date to View Records</Text>
          
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={[styles.navBtn, theme.inputBg]} onPress={() => changeDateByDays(-1)}>
              <Text style={[styles.navBtnText, theme.text]}>◀ Prev Day</Text>
            </TouchableOpacity>

            <input
              type="date"
              style={responsiveDateInputStyle}
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setExpenseDate(e.target.value);
                }
              }}
            />

            <TouchableOpacity style={[styles.navBtn, theme.inputBg]} onPress={() => changeDateByDays(1)}>
              <Text style={[styles.navBtnText, theme.text]}>Next Day ▶</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.todayQuickRow}>
            <TouchableOpacity
              style={[styles.todayChip, selectedDate === getTodayString() ? styles.todayChipActive : theme.inputBg]}
              onPress={() => {
                const today = getTodayString();
                setSelectedDate(today);
                setExpenseDate(today);
              }}
            >
              <Text style={selectedDate === getTodayString() ? styles.todayChipTextActive : theme.text}>
                🗓️ Today ({getTodayString()})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Salary Income Card */}
        <View style={[styles.card, theme.card]}>
          <Text style={[styles.cardHeader, theme.text]}>💵 Salary Income</Text>
          <View style={[styles.inputRow, theme.inputBg]}>
            <Text style={styles.pesoSign}>₱</Text>
            <TextInput
              style={[styles.salaryInput, theme.text]}
              value={salaryInputVal}
              onChangeText={setSalaryInputVal}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateSalary}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance & Overview Card */}
        <View style={[styles.card, theme.card]}>
          <View style={styles.balGrid}>
            <View style={[styles.balBox, theme.inputBg]}>
              <Text style={[styles.balLabel, theme.subtext]}>Total Salary</Text>
              <Text style={[styles.balValue, theme.text]}>{formatPeso(salary)}</Text>
            </View>
            <View style={[styles.balBox, theme.inputBg]}>
              <Text style={[styles.balLabel, theme.subtext]}>Expenses ({selectedDate})</Text>
              <Text style={[styles.balValue, styles.redText]}>{formatPeso(totalDateExpenses)}</Text>
            </View>
          </View>

          {/* Remaining Banner */}
          <View style={[
            styles.remainingBox,
            remaining < 0 || spentPct > 90 ? styles.dangerBox :
            spentPct >= 75 ? styles.warningBox : styles.greenBox
          ]}>
            <Text style={styles.remainingLabel}>REMAINING BALANCE (OVERALL)</Text>
            <Text style={[
              styles.remainingValue,
              remaining < 0 || spentPct > 90 ? styles.redText :
              spentPct >= 75 ? styles.amberText : styles.greenText
            ]}>
              {formatPeso(remaining)}
            </Text>
          </View>

          {/* Spent Progress Bar */}
          <View style={styles.progressRow}>
            <Text style={[styles.progressText, theme.subtext]}>Spent: {spentPct}%</Text>
            <Text style={[
              styles.statusText,
              remaining < 0 || spentPct > 90 ? styles.redText :
              spentPct >= 75 ? styles.amberText : styles.greenText
            ]}>
              {remaining < 0 || spentPct > 90 ? 'Critical!' : spentPct >= 75 ? 'Warning (75%+)' : 'Healthy'}
            </Text>
          </View>
          <View style={[styles.progressBg, theme.inputBg]}>
            <View style={[
              styles.progressFill,
              { width: `${Math.min(spentPct, 100)}%` },
              remaining < 0 || spentPct > 90 ? styles.fillRed :
              spentPct >= 75 ? styles.fillAmber : styles.fillGreen
            ]} />
          </View>
        </View>

        {/* Add Expense Card for Selected Date */}
        <View style={[styles.card, theme.card]}>
          <Text style={[styles.cardHeader, theme.text]}>➕ Add Expense for {expenseDate}</Text>

          {/* Date for New Expense */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, theme.subtext]}>Expense Date</Text>
            <input
              type="date"
              style={responsiveDateInputStyle}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </View>

          {/* Quick Presets */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
            <Text style={[styles.presetLabel, theme.subtext]}>Quick Add: </Text>
            <TouchableOpacity style={[styles.chip, theme.chip]} onPress={() => handlePreset('Rice & Groceries', 'Food')}>
              <Text style={theme.text}>🍚 Rice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, theme.chip]} onPress={() => handlePreset('Electric Bill', 'Bills')}>
              <Text style={theme.text}>⚡ Electricity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, theme.chip]} onPress={() => handlePreset('Water Bill', 'Bills')}>
              <Text style={theme.text}>💧 Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, theme.chip]} onPress={() => handlePreset('Internet', 'Bills')}>
              <Text style={theme.text}>🌐 Internet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, theme.chip]} onPress={() => handlePreset('Transpo', 'Transport')}>
              <Text style={theme.text}>🚌 Transpo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, theme.chip]} onPress={() => handlePreset('Rent', 'Housing')}>
              <Text style={theme.text}>🏠 Rent</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Form Fields */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, theme.subtext]}>Expense Description</Text>
            <TextInput
              style={[styles.input, theme.inputBg, theme.text]}
              placeholder="e.g. Electric Bill, Rice..."
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.responsiveFormGrid}>
            <View style={styles.flex1}>
              <Text style={[styles.fieldLabel, theme.subtext]}>Amount (₱)</Text>
              <TextInput
                style={[styles.input, theme.inputBg, theme.text]}
                placeholder="0.00"
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.flex1}>
              <Text style={[styles.fieldLabel, theme.subtext]}>Category</Text>
              <select
                style={responsiveSelectStyle}
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

          <TouchableOpacity style={styles.addBtn} onPress={handleAddExpense}>
            <Text style={styles.addBtnText}>➕ Add Expense for {expenseDate}</Text>
          </TouchableOpacity>
        </View>

        {/* Expense Records List for Selected Date */}
        <View style={[styles.card, theme.card]}>
          <View style={styles.listHeaderRow}>
            <Text style={[styles.cardHeader, theme.text]}>📝 Records for {selectedDate}</Text>
            <select
              style={{
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                color: isDark ? '#f8fafc' : '#0f172a',
                border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 13,
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
            <Text style={[styles.emptyText, theme.subtext]}>No expenses recorded on {selectedDate}.</Text>
          ) : (
            filteredExpenses.map(item => {
              const catInfo = CATEGORIES[item.category] || CATEGORIES.Others;
              return (
                <View key={item.id} style={[styles.itemRow, theme.inputBg]}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemEmoji}>{catInfo.emoji}</Text>
                    <View style={styles.itemTextWrapper}>
                      <Text style={[styles.itemTitle, theme.text]}>{item.name}</Text>
                      <Text style={[styles.itemSub, theme.subtext]}>{catInfo.label} &bull; 📅 {item.date}</Text>
                    </View>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.itemAmount}>-{formatPeso(item.amount)}</Text>
                    <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                      <Text style={{ fontSize: 16 }}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                      <Text style={{ fontSize: 16 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          {/* List Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={[styles.secBtn, theme.inputBg]} onPress={handleExportCSV}>
              <Text style={[styles.secBtnText, theme.text]}>📄 Export All CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerBtn} onPress={handleClearAll}>
              <Text style={styles.dangerBtnText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.footerText, theme.subtext]}>React Native Budget Tracker &bull; Super Responsive</Text>

      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editItem} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, theme.card]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, theme.text]}>✏️ Edit Expense Record</Text>
              <TouchableOpacity onPress={() => setEditItem(null)}>
                <Text style={[styles.closeX, theme.subtext]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, theme.subtext]}>Date</Text>
            <input
              type="date"
              style={responsiveDateInputStyle}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <Text style={[styles.fieldLabel, theme.subtext]}>Description</Text>
            <TextInput
              style={[styles.input, theme.inputBg, theme.text]}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={[styles.fieldLabel, theme.subtext]}>Amount (₱)</Text>
            <TextInput
              style={[styles.input, theme.inputBg, theme.text]}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
            />

            <Text style={[styles.fieldLabel, theme.subtext]}>Category</Text>
            <select
              style={responsiveSelectStyle}
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              {Object.keys(CATEGORIES).map(key => (
                <option key={key} value={key}>
                  {CATEGORIES[key].emoji} {CATEGORIES[key].label}
                </option>
              ))}
            </select>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.secBtn, theme.inputBg]} onPress={() => setEditItem(null)}>
                <Text style={theme.text}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleSaveEdit}>
                <Text style={styles.addBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Ultra Responsive StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  todayQuickRow: {
    marginTop: 4,
    alignItems: 'center',
  },
  todayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  todayChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  todayChipTextActive: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 180,
  },
  titleWrapper: {
    flex: 1,
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
  },
  themeBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 20,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
  },
  fieldGroup: {
    gap: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 46,
  },
  pesoSign: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
    marginRight: 6,
  },
  salaryInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    outlineStyle: 'none',
  },
  saveBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  balGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  balBox: {
    flex: 1,
    minWidth: 130,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  balLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  balValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  remainingBox: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  greenBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10b981',
  },
  warningBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#f59e0b',
  },
  dangerBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#ef4444',
  },
  remainingLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
  },
  remainingValue: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBg: {
    height: 8,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
  },
  fillGreen: { backgroundColor: '#10b981' },
  fillAmber: { backgroundColor: '#f59e0b' },
  fillRed: { backgroundColor: '#ef4444' },
  presetsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'center',
    marginRight: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    borderWidth: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 14,
    outlineStyle: 'none',
  },
  responsiveFormGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  flex1: {
    flex: 1,
    minWidth: 130,
  },
  addBtn: {
    backgroundColor: '#3b82f6',
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    flexWrap: 'wrap',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 140,
  },
  itemTextWrapper: {
    flex: 1,
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  itemSub: {
    fontSize: 11,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
  },
  actionBtn: {
    padding: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  secBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  secBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dangerBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 10,
  },
  greenText: { color: '#10b981' },
  amberText: { color: '#f59e0b' },
  redText: { color: '#ef4444' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    padding: 20,
    gap: 12,
    borderWidth: 1,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeX: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  }
});

// Theme Colors
const darkTheme = {
  container: { backgroundColor: '#0f172a' },
  card: { backgroundColor: '#1e293b', borderColor: '#334155' },
  inputBg: { backgroundColor: '#0f172a', borderColor: '#334155' },
  text: { color: '#f8fafc' },
  subtext: { color: '#94a3b8' },
  themeBtn: { backgroundColor: '#0f172a', borderColor: '#334155' },
  chip: { backgroundColor: '#0f172a', borderColor: '#334155' },
};

const lightTheme = {
  container: { backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', borderColor: '#cbd5e1' },
  inputBg: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
  text: { color: '#0f172a' },
  subtext: { color: '#64748b' },
  themeBtn: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
  chip: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
};
