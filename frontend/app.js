/**
 * Salary Budget Tracker — Main Application Logic
 */

// Category Definitions with Icons
const CATEGORIES = {
  Food: { label: 'Food & Groceries', icon: 'fa-utensils', emoji: '🍚' },
  Bills: { label: 'Bills & Utilities', icon: 'fa-bolt', emoji: '⚡' },
  Transport: { label: 'Transportation', icon: 'fa-bus', emoji: '🚌' },
  Housing: { label: 'Rent & Housing', icon: 'fa-house', emoji: '🏠' },
  Health: { label: 'Health & Medical', icon: 'fa-briefcase-medical', emoji: '🏥' },
  Shopping: { label: 'Shopping & Personal', icon: 'fa-bag-shopping', emoji: '🛍️' },
  Entertainment: { label: 'Entertainment', icon: 'fa-gamepad', emoji: '🎮' },
  Others: { label: 'Other Expenses', icon: 'fa-lightbulb', emoji: '💡' }
};

// Initial State
let state = {
  salary: 11153.80,
  expenses: [],
  theme: 'dark'
};

// PWA Install Prompt Deferred Event
let deferredPrompt = null;

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
const pwaInstallBtn = document.getElementById('pwa-install-btn');
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

// Install Guide Modal Elements
const installGuideModal = document.getElementById('install-guide-modal');
const closeInstallModalBtn = document.getElementById('close-install-modal-btn');
const gotItBtn = document.getElementById('got-it-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  setupEventListeners();
  renderApp();
  registerServiceWorker();
});

// Load from localStorage
function loadSavedData() {
  const savedState = localStorage.getItem('salary_budget_tracker_data');
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

  // Set Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
  
  // Set Salary Field
  salaryInput.value = state.salary;
}

// Save to localStorage
function saveData() {
  localStorage.setItem('salary_budget_tracker_data', JSON.stringify(state));
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

// Setup Event Listeners
function setupEventListeners() {
  // Update Salary
  updateSalaryBtn.addEventListener('click', () => {
    const val = parseFloat(salaryInput.value);
    if (!isNaN(val) && val >= 0) {
      state.salary = val;
      saveData();
      renderApp();
      showToast('Salary updated to ' + formatPeso(val));
    } else {
      showToast('Please enter a valid salary amount', true);
    }
  });

  // Salary enter key
  salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      updateSalaryBtn.click();
    }
  });

  // Add Expense
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;

    if (!name || isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid expense name and amount', true);
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

    // Reset Form
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseNameInput.focus();

    showToast(`Added "${name}" (${formatPeso(amount)})`);
  });

  // Quick Preset Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      expenseNameInput.value = chip.dataset.name;
      if (chip.dataset.cat) {
        expenseCategoryInput.value = chip.dataset.cat;
      }
      expenseAmountInput.focus();
    });
  });

  // Filter Category Change
  categoryFilter.addEventListener('change', () => {
    renderExpenseList();
  });

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
    saveData();
  });

  // Export CSV/Report
  exportBtn.addEventListener('click', exportBudgetReport);

  // Clear All
  clearAllBtn.addEventListener('click', () => {
    if (state.expenses.length === 0) {
      showToast('No expenses to clear');
      return;
    }
    if (confirm('Are you sure you want to clear ALL expenses?')) {
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
    const name = editNameInput.value.trim();
    const amount = parseFloat(editAmountInput.value);
    const category = editCategoryInput.value;

    const item = state.expenses.find(exp => exp.id === id);
    if (item) {
      item.name = name;
      item.amount = amount;
      item.category = category;
      saveData();
      renderApp();
      closeModal();
      showToast('Expense updated');
    }
  });

  // Install Guide Modal Listeners
  closeInstallModalBtn.addEventListener('click', () => installGuideModal.style.display = 'none');
  gotItBtn.addEventListener('click', () => installGuideModal.style.display = 'none');
  installGuideModal.addEventListener('click', (e) => {
    if (e.target === installGuideModal) installGuideModal.style.display = 'none';
  });

  // Install Button Click Handler
  pwaInstallBtn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('App installed successfully!');
        }
        deferredPrompt = null;
      });
    } else {
      // Show step-by-step installation guide popup
      installGuideModal.style.display = 'flex';
    }
  });
}

// Render Entire UI
function renderApp() {
  // 1. Calculate Totals
  const totalSalary = state.salary;
  const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBalance = totalSalary - totalExpenses;
  const spentPct = totalSalary > 0 ? Math.min(Math.round((totalExpenses / totalSalary) * 100), 999) : 0;

  // 2. Update Displays
  dispTotalSalary.textContent = formatPeso(totalSalary);
  dispTotalExpenses.textContent = formatPeso(totalExpenses);
  dispRemainingBalance.textContent = formatPeso(remainingBalance);
  spentPercentage.textContent = `${spentPct}%`;

  // 3. Progress Bar & Health Status
  progressBarFill.style.width = `${Math.min(spentPct, 100)}%`;
  
  const remainingBox = document.querySelector('.summary-box.remaining-box');
  remainingBox.classList.remove('warning', 'danger');
  progressBarFill.classList.remove('warning', 'danger');

  if (remainingBalance < 0 || spentPct > 90) {
    remainingBox.classList.add('danger');
    progressBarFill.classList.add('danger');
    budgetStatusText.className = 'status-danger';
    budgetStatusText.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Critical / Over Budget!';
  } else if (spentPct >= 75) {
    remainingBox.classList.add('warning');
    progressBarFill.classList.add('warning');
    budgetStatusText.className = 'status-warning';
    budgetStatusText.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Warning: 75%+ Spent';
  } else {
    budgetStatusText.className = 'status-good';
    budgetStatusText.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Healthy Budget';
  }

  // 4. Render Expenses List
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
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach(item => {
    const catInfo = CATEGORIES[item.category] || CATEGORIES.Others;
    
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
      <div class="expense-icon">
        <i class="fa-solid ${catInfo.icon}"></i>
      </div>
      <div class="expense-details">
        <span class="expense-title">${escapeHtml(item.name)}</span>
        <span class="expense-meta">${catInfo.emoji} ${catInfo.label} &bull; ${item.date || 'Today'}</span>
      </div>
      <div class="expense-amount-actions">
        <span class="expense-amount">-${formatPeso(item.amount)}</span>
        <div class="item-actions">
          <button class="action-btn edit-btn" onclick="openEditModal('${item.id}')" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="action-btn delete-btn" onclick="deleteExpense('${item.id}')" title="Delete">
            <i class="fa-solid fa-trash-can"></i>
          </button>
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
    showToast('Expense deleted');
  }
};

// Open Edit Modal
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

// Theme Icon Update
function updateThemeIcon() {
  const icon = themeToggleBtn.querySelector('i');
  if (state.theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// Export Budget Report to Text / CSV File
function exportBudgetReport() {
  if (state.expenses.length === 0) {
    showToast('No data to export', true);
    return;
  }

  const totalSalary = state.salary;
  const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalSalary - totalExpenses;

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "SALARY BUDGET TRACKER REPORT\n";
  csvContent += `Total Salary,${totalSalary}\n`;
  csvContent += `Total Expenses,${totalExpenses}\n`;
  csvContent += `Remaining Balance,${remaining}\n\n`;
  csvContent += "Date,Expense Description,Category,Amount (PHP)\n";

  state.expenses.forEach(exp => {
    csvContent += `"${exp.date || ''}","${exp.name.replace(/"/g, '""')}","${exp.category}",${exp.amount}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Salary_Budget_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Budget report downloaded!');
}

// Helper: Toast Notifications
function showToast(msg, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `
    <i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Helper: Escape HTML
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// PWA Service Worker Registration & Install Banner
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  }

  // Capture Install Prompt Event for Mobile Phones
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}
