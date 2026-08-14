/**
 * Salary Budget Tracker — Simple 100% Offline Logic
 */

// Category Definitions with Emojis
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

// Initial State
let state = {
  salary: 11153.80,
  expenses: [],
  theme: 'dark'
};

// DOM Elements
const salaryInput = document.getElementById('salary-input');
const updateSalaryBtn = document.getElementById('update-salary-btn');
const dispTotalSalary = document.getElementById('disp-total-salary');
const dispTotalExpenses = document.getElementById('disp-total-expenses');
const dispRemainingBalance = document.getElementById('disp-remaining-balance');
const spentPercentage = document.getElementById('spent-percentage');
const progressBarFill = document.getElementById('progress-bar-fill');
const budgetStatusText = document.getElementById('budget-status-text');

const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const emptyState = document.getElementById('empty-state');
const categoryFilter = document.getElementById('category-filter');

const themeToggleBtn = document.getElementById('theme-toggle');
const downloadAppBtn = document.getElementById('download-app-btn');
const exportBtn = document.getElementById('export-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// Edit Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-expense-form');
const editIdInput = document.getElementById('edit-expense-id');
const editNameInput = document.getElementById('edit-expense-name');
const editAmountInput = document.getElementById('edit-expense-amount');
const editCategoryInput = document.getElementById('edit-expense-category');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  setupEventListeners();
  renderApp();
  registerServiceWorker();
});

// Load from localStorage
function loadSavedData() {
  const savedState = localStorage.getItem('simple_salary_budget_data');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      state.salary = typeof parsed.salary === 'number' ? parsed.salary : 11153.80;
      state.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
      state.theme = parsed.theme || 'dark';
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }

  document.documentElement.setAttribute('data-theme', state.theme);
  themeToggleBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  salaryInput.value = state.salary;
}

// Save to localStorage
function saveData() {
  localStorage.setItem('simple_salary_budget_data', JSON.stringify(state));
}

// Currency Formatter
function formatPeso(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Event Listeners
function setupEventListeners() {
  // Save Salary
  updateSalaryBtn.addEventListener('click', () => {
    const val = parseFloat(salaryInput.value);
    if (!isNaN(val) && val >= 0) {
      state.salary = val;
      saveData();
      renderApp();
      showToast('Salary saved: ' + formatPeso(val));
    } else {
      showToast('Please enter a valid salary', true);
    }
  });

  salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') updateSalaryBtn.click();
  });

  // Add Expense
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;

    if (!name || isNaN(amount) || amount <= 0) {
      showToast('Please enter valid name and amount', true);
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      name,
      amount,
      category,
      date: new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
    };

    state.expenses.unshift(newExpense);
    saveData();
    renderApp();

    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseNameInput.focus();

    showToast(`Added: ${name} (${formatPeso(amount)})`);
  });

  // Presets
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      expenseNameInput.value = chip.dataset.name;
      if (chip.dataset.cat) expenseCategoryInput.value = chip.dataset.cat;
      expenseAmountInput.focus();
    });
  });

  // Filter
  categoryFilter.addEventListener('change', renderExpenseList);

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    themeToggleBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    saveData();
  });

  // Download Offline Standalone App File
  downloadAppBtn.addEventListener('click', downloadSingleFileApp);

  // Export CSV
  exportBtn.addEventListener('click', exportBudgetReport);

  // Clear All
  clearAllBtn.addEventListener('click', () => {
    if (state.expenses.length === 0) return;
    if (confirm('Clear all expenses?')) {
      state.expenses = [];
      saveData();
      renderApp();
      showToast('All expenses cleared');
    }
  });

  // Modal Listeners
  closeModalBtn.addEventListener('click', closeModal);
  cancelEditBtn.addEventListener('click', closeModal);
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeModal();
  });

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editIdInput.value;
    const item = state.expenses.find(exp => exp.id === id);
    if (item) {
      item.name = editNameInput.value.trim();
      item.amount = parseFloat(editAmountInput.value);
      item.category = editCategoryInput.value;
      saveData();
      renderApp();
      closeModal();
      showToast('Expense updated');
    }
  });
}

// Render Entire UI
function renderApp() {
  const totalSalary = state.salary;
  const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBalance = totalSalary - totalExpenses;
  const spentPct = totalSalary > 0 ? Math.min(Math.round((totalExpenses / totalSalary) * 100), 999) : 0;

  dispTotalSalary.textContent = formatPeso(totalSalary);
  dispTotalExpenses.textContent = formatPeso(totalExpenses);
  dispRemainingBalance.textContent = formatPeso(remainingBalance);
  spentPercentage.textContent = `${spentPct}%`;

  progressBarFill.style.width = `${Math.min(spentPct, 100)}%`;

  const remainingBox = document.getElementById('remaining-box');
  remainingBox.classList.remove('warning', 'danger');
  progressBarFill.classList.remove('warning', 'danger');

  if (remainingBalance < 0 || spentPct > 90) {
    remainingBox.classList.add('danger');
    progressBarFill.classList.add('danger');
    budgetStatusText.className = 'text-danger';
    budgetStatusText.textContent = 'Critical!';
  } else if (spentPct >= 75) {
    remainingBox.classList.add('warning');
    progressBarFill.classList.add('warning');
    budgetStatusText.className = 'text-warning';
    budgetStatusText.textContent = '75%+ Spent';
  } else {
    budgetStatusText.className = 'text-success';
    budgetStatusText.textContent = 'Healthy';
  }

  renderExpenseList();
}

// Render Expense Items
function renderExpenseList() {
  const filter = categoryFilter.value;
  const filtered = filter === 'ALL' 
    ? state.expenses 
    : state.expenses.filter(item => item.category === filter);

  expenseList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach(item => {
    const catInfo = CATEGORIES[item.category] || CATEGORIES.Others;
    
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
      <div class="exp-left">
        <span class="exp-emoji">${catInfo.emoji}</span>
        <div>
          <div class="exp-title">${escapeHtml(item.name)}</div>
          <div class="exp-sub">${catInfo.label} &bull; ${item.date || 'Today'}</div>
        </div>
      </div>
      <div class="exp-right">
        <span class="exp-amount">-${formatPeso(item.amount)}</span>
        <div class="exp-actions">
          <button class="exp-btn" onclick="openEditModal('${item.id}')" title="Edit">✏️</button>
          <button class="exp-btn" onclick="deleteExpense('${item.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
    expenseList.appendChild(div);
  });
}

// Delete Expense
window.deleteExpense = function(id) {
  const item = state.expenses.find(e => e.id === id);
  if (item && confirm(`Delete "${item.name}"?`)) {
    state.expenses = state.expenses.filter(e => e.id !== id);
    saveData();
    renderApp();
    showToast('Deleted');
  }
};

// Edit Expense Modal
window.openEditModal = function(id) {
  const item = state.expenses.find(e => e.id === id);
  if (!item) return;

  editIdInput.value = item.id;
  editNameInput.value = item.name;
  editAmountInput.value = item.amount;
  editCategoryInput.value = item.category || 'Others';

  editModal.style.display = 'flex';
};

function closeModal() {
  editModal.style.display = 'none';
}

// Download Offline Standalone App HTML File for Phone
function downloadSingleFileApp() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Salary Budget Tracker</title>
  <style>
  ${document.querySelector('style')?.textContent || ''}
  </style>
</head>
<body>
${document.body.innerHTML}
</body>
</html>`;

  const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SalaryBudgetTracker.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Offline App File downloaded! Open in phone browser.');
}

// Export CSV Report
function exportBudgetReport() {
  if (state.expenses.length === 0) {
    showToast('No expenses to export', true);
    return;
  }

  let csv = "Date,Expense Description,Category,Amount (PHP)\n";
  state.expenses.forEach(exp => {
    csv += `"${exp.date || ''}","${exp.name.replace(/"/g, '""')}","${exp.category}",${exp.amount}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Salary_Budget_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('CSV Report downloaded');
}

// Helper: Toast
function showToast(msg, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m]);
}

// Register Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.error('SW failed', err));
  }
}
