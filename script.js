// ========================================
// MONTHLY HABIT & TASK TRACKER
// Pure Vanilla JavaScript - No Dependencies
// ========================================

// ========================================
// STATE MANAGEMENT
// ========================================

const state = {
  // Task storage: Array of task names
  tasks: JSON.parse(localStorage.getItem('trackerTasks')) || [],

  // Task completion: Object with structure {dateKey: [taskIndex1, taskIndex2, ...]}
  // date format: "YYYY-MM-DD"
  // Tracks which tasks are completed on which days
  completions: JSON.parse(localStorage.getItem('trackerCompletions')) || {},

  // Current selected month (0-11)
  currentMonth: new Date().getMonth(),

  // Current year
  currentYear: new Date().getFullYear(),
};

// ========================================
// DOM REFERENCES
// ========================================

const DOM = {
  monthDisplay: document.getElementById('monthDisplay'),
  monthSelect: document.getElementById('monthSelect'),
  taskInput: document.getElementById('taskInput'),
  addTaskBtn: document.getElementById('addTaskBtn'),
  tasksList: document.getElementById('tasksList'),
  daysGrid: document.getElementById('daysGrid'),
  monthlyPercent: document.getElementById('monthlyPercent'),
  monthlyInfo: document.getElementById('monthlyInfo'),
  monthlyCircle: document.getElementById('monthlyCircle'),
  emptyState: document.getElementById('emptyState'),
};

// ========================================
// CONSTANTS
// ========================================

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get the number of days in a given month
 */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Format a date as YYYY-MM-DD for consistent storage
 */
function formatDateKey(day, month, year) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/**
 * Get the weekday name for a given day
 */
function getWeekday(day, month, year) {
  const date = new Date(year, month, day);
  return WEEKDAY_NAMES[date.getDay()];
}

/**
 * Format full date string for tooltip (e.g., "12 March 2026")
 */
function formatFullDate(day, month, year) {
  return `${day} ${MONTH_NAMES[month]} ${year}`;
}

/**
 * Save state to localStorage
 */
function saveState() {
  localStorage.setItem('trackerTasks', JSON.stringify(state.tasks));
  localStorage.setItem('trackerCompletions', JSON.stringify(state.completions));
}

/**
 * Calculate progress for the current month
 * Returns: { completed, total, percentage }
 */
function calculateProgress() {
  const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === state.currentMonth && today.getFullYear() === state.currentYear;
  const todayDay = isCurrentMonth ? today.getDate() : null;

  let monthCompletedTasks = 0;
  let monthTotalTasks = 0;
  let dayCompletedTasks = 0;
  let dayTotalTasks = 0;

  // Calculate total tasks for the entire month (tasks × days)
  monthTotalTasks = state.tasks.length * daysInMonth;

  // Count completed tasks and today's progress
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(day, state.currentMonth, state.currentYear);
    const taskCompletions = state.completions[dateKey] || [];

    // Count completed tasks for this day
    monthCompletedTasks += taskCompletions.length;

    // Count today's stats if this is today
    if (isCurrentMonth && day === todayDay) {
      dayTotalTasks = state.tasks.length;
      dayCompletedTasks = taskCompletions.length;
    }
  }

  const monthPercentage = monthTotalTasks > 0 ? Math.round((monthCompletedTasks / monthTotalTasks) * 100) : 0;
  const dayPercentage = dayTotalTasks > 0 ? Math.round((dayCompletedTasks / dayTotalTasks) * 100) : 0;

  return {
    month: {
      completed: monthCompletedTasks,
      total: monthTotalTasks,
      percentage: monthPercentage,
    },
    day: {
      completed: dayCompletedTasks,
      total: dayTotalTasks,
      percentage: dayPercentage,
    },
  };
}

/**
 * Update circular progress displays
 */
function updateProgress() {
  const progress = calculateProgress();

  // Update monthly progress circle
  updateCircle(DOM.monthlyCircle, progress.month.percentage);
  DOM.monthlyPercent.textContent = `${progress.month.percentage}%`;
  DOM.monthlyInfo.textContent = `${progress.month.completed} / ${progress.month.total} tasks`;
}

/**
 * Update circle stroke based on percentage
 */
function updateCircle(circle, percentage) {
  const circumference = 2 * Math.PI * 50; // radius = 50
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// ========================================
// TASK MANAGEMENT
// ========================================

/**
 * Add a new task
 */
function addTask() {
  const taskName = DOM.taskInput.value.trim();

  if (!taskName) {
    DOM.taskInput.focus();
    return;
  }

  if (state.tasks.length >= 20) {
    alert('Maximum 20 tasks allowed');
    return;
  }

  state.tasks.push(taskName);
  DOM.taskInput.value = '';

  saveState();
  render();

  DOM.taskInput.focus();
}

/**
 * Delete a task and all its completions
 */
function deleteTask(index) {
  if (confirm(`Delete task "${state.tasks[index]}"?`)) {
    state.tasks.splice(index, 1);

    // Remove all completions for this task from all dates
    Object.keys(state.completions).forEach(dateKey => {
      const taskArray = state.completions[dateKey];
      if (Array.isArray(taskArray)) {
        // Remove this task index and adjust remaining indices
        const filtered = taskArray
          .filter(idx => idx !== index)
          .map(idx => (idx > index ? idx - 1 : idx));
        if (filtered.length > 0) {
          state.completions[dateKey] = filtered;
        } else {
          delete state.completions[dateKey];
        }
      }
    });

    saveState();
    render();
  }
}

/**
 * Render the tasks sidebar
 */
function renderTasks() {
  DOM.tasksList.innerHTML = '';

  if (state.tasks.length === 0) {
    DOM.emptyState.classList.add('show');
    return;
  }

  DOM.emptyState.classList.remove('show');

  state.tasks.forEach((taskName, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskNameEl = document.createElement('span');
    taskNameEl.className = 'task-name';
    taskNameEl.textContent = taskName;
    taskNameEl.title = taskName;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    taskItem.appendChild(taskNameEl);
    taskItem.appendChild(deleteBtn);
    DOM.tasksList.appendChild(taskItem);
  });
}

// ========================================
// GRID RENDERING
// ========================================

/**
 * Render the complete calendar grid with day headers and task cells
 */
function renderGrid() {
  DOM.daysGrid.innerHTML = '';

  const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);

  // Set grid to have one column per day
  DOM.daysGrid.style.gridTemplateColumns = `repeat(${daysInMonth}, 1fr)`;

  // Render day headers
  for (let day = 1; day <= daysInMonth; day++) {
    const header = document.createElement('div');
    header.className = 'day-header';

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;

    const dayWeekday = document.createElement('div');
    dayWeekday.className = 'day-weekday';
    dayWeekday.textContent = getWeekday(day, state.currentMonth, state.currentYear);

    header.appendChild(dayNumber);
    header.appendChild(dayWeekday);
    header.title = formatFullDate(day, state.currentMonth, state.currentYear);

    DOM.daysGrid.appendChild(header);
  }

  // Render task cells (checkboxes)
  state.tasks.forEach((taskName, taskIndex) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(day, state.currentMonth, state.currentYear);

      const cell = document.createElement('div');
      cell.className = 'day-cell';

      cell.title = formatFullDate(day, state.currentMonth, state.currentYear);

      // Create checkbox input
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.id = `check-${taskIndex}-${dateKey}`;

      // Check if this task is completed for this day
      const taskCompletions = state.completions[dateKey] || [];
      if (Array.isArray(taskCompletions) && taskCompletions.includes(taskIndex)) {
        checkbox.checked = true;
        cell.classList.add('completed');
      }

      // Handle checkbox change
      checkbox.onchange = () => {
        if (!Array.isArray(state.completions[dateKey])) {
          state.completions[dateKey] = [];
        }

        if (checkbox.checked) {
          // Add this task to completions for this day
          if (!state.completions[dateKey].includes(taskIndex)) {
            state.completions[dateKey].push(taskIndex);
          }
          cell.classList.add('completed');
        } else {
          // Remove this task from completions for this day
          state.completions[dateKey] = state.completions[dateKey].filter(idx => idx !== taskIndex);
          if (state.completions[dateKey].length === 0) {
            delete state.completions[dateKey];
            cell.classList.remove('completed');
          } else {
            // Day still has other completed tasks
            cell.classList.add('completed');
          }
        }

        saveState();
        updateProgress();
      };

      cell.appendChild(checkbox);
      DOM.daysGrid.appendChild(cell);
    }
  });
}

/**
 * Update visual state of day cells (highlight completed tasks)
 */
function updateCellStates() {
  const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
  const cells = document.querySelectorAll('.day-cell');

  state.tasks.forEach((_, taskIndex) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(day, state.currentMonth, state.currentYear);
      const cellIndex = taskIndex * daysInMonth + (day - 1);
      const cell = cells[cellIndex];

      if (!cell) return;

      const taskCompletions = state.completions[dateKey] || [];
      if (Array.isArray(taskCompletions) && taskCompletions.includes(taskIndex)) {
        cell.classList.add('completed');
      } else {
        cell.classList.remove('completed');
      }
    }
  });
}


// ========================================
// MONTH SELECTION
// ========================================

/**
 * Render month selector dropdown
 */
function renderMonthSelector() {
  DOM.monthSelect.innerHTML = '';

  MONTH_NAMES.forEach((monthName, monthIndex) => {
    const option = document.createElement('option');
    option.value = monthIndex;
    option.textContent = monthName;

    if (monthIndex === state.currentMonth) {
      option.selected = true;
    }

    DOM.monthSelect.appendChild(option);
  });

  DOM.monthSelect.onchange = () => {
    state.currentMonth = parseInt(DOM.monthSelect.value, 10);
    updateMonthDisplay();
    renderGrid();
    updateProgress();
  };
}

/**
 * Update month display title
 */
function updateMonthDisplay() {
  const monthYear = `${MONTH_NAMES[state.currentMonth]} ${state.currentYear}`;
  DOM.monthDisplay.textContent = monthYear;
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Add task button
  DOM.addTaskBtn.onclick = addTask;

  // Add task on Enter key
  DOM.taskInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };
}

// ========================================
// MAIN RENDER FUNCTION
// ========================================

/**
 * Main render function - orchestrates all rendering
 */
function render() {
  updateMonthDisplay();
  renderMonthSelector();
  renderTasks();
  renderGrid();
  updateProgress();
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the application
 */
function init() {
  setupEventListeners();
  render();
  console.log('✅ Monthly Habit Tracker initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}





if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
