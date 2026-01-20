# Task & Habit Tracker

A modern, offline-first task and habit tracking web application built with **pure vanilla HTML, CSS, and JavaScript**. No frameworks, no dependencies—just clean, efficient code.

## ✨ Features

- **📋 Task Management**
  - Add and delete tasks effortlessly
  - Maximum 20 tasks to keep focus sharp
  - Real-time validation to prevent empty tasks

- **📅 Monthly Calendar View**
  - One-column-per-day layout
  - Correct day counts for all months (leap year support)
  - Current day visually highlighted
  - Smooth, responsive scrolling

- **✅ Completion Tracking**
  - Check off tasks per day with smooth animations
  - Color-coded visual feedback (cyan hover, green completion)
  - Persistent completion history

- **📊 Progress Analytics**
  - Monthly progress circle with animated percentage
  - Real-time calculation based on total completions
  - Visual indicators for task completion rate

- **💾 Offline-First Architecture**
  - All data stored in browser localStorage
  - Works completely offline
  - Automatic persistence on every action

- **🎨 Modern, Responsive UI**
  - Clean, professional design with vibrant colors
  - Fully responsive (desktop, tablet, mobile)
  - Smooth transitions and hover effects
  - Accessibility-friendly contrast ratios

- **⌨️ Keyboard Support**
  - Press Enter to quickly add new tasks
  - Full accessibility for screen readers

## 🚀 Getting Started

### Installation

No installation needed! Simply:

1. Download or clone the project
2. Open `index.html` in any modern web browser
3. Start tracking your tasks!

```bash
# Clone the repository
git clone <repository-url>
cd taskmanager

# Open in browser (macOS/Linux)
open index.html

# Open in browser (Windows)
start index.html
```

## 📖 How to Use

### Adding a Task

1. Type task name in the input field at the top
2. Click **"+ Add Task"** or press **Enter**
3. Your task appears in the left sidebar

### Tracking Completion

1. Each row represents a task
2. Each column represents a day of the month
3. Click the checkbox to mark a task complete for that day
4. Completed cells turn green with an inset glow
5. Progress circle updates instantly

### Changing Months

1. Use the **month selector dropdown** at the top
2. Calendar automatically updates to show the selected month
3. Progress updates to reflect monthly totals

### Deleting Tasks

1. Hover over a task in the sidebar
2. Click the **×** button that appears
3. Task and all its completion history are removed

## 🏗️ Architecture

### State Management

```javascript
const state = {
  tasks: Array<string>,           // Task names
  completions: Object<{           // Completion data
    "YYYY-MM-DD": [taskIndex]     // Tasks completed per day
  }>,
  currentMonth: number,           // 0-11
  currentYear: number
}
```

### Data Persistence

- **localStorage key**: `trackerTasks` (task names)
- **localStorage key**: `trackerCompletions` (completion dates)
- Data is automatically saved on every action

### Core Functions

- `addTask(name)` - Add new task with validation
- `deleteTask(index)` - Remove task and completions
- `toggleCompletion(taskIndex, dateKey)` - Mark/unmark task completion
- `calculateProgress()` - Compute monthly progress percentage
- `render()` - Full UI re-render on state changes

## 🎨 Design Highlights

### Color Scheme

- **Primary**: Cyan (#06b6d4) - Interactive elements
- **Success**: Green (#22c55e) - Completed tasks
- **Danger**: Red (#ef4444) - Delete actions
- **Background**: Light blue gradients (#f0f9ff)
- **Headers**: Deep blue (#1e3a8a)

### Interactions

- Hover effects on all interactive elements
- Smooth scale animations (0.3s easing)
- Drop shadow glows on checkboxes
- Left-slide animation on task hover
- Gradient transitions on cell completion

## 🌐 Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Opera 74+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with sidebar + calendar
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Stack layout, adjusted font sizes

## 🔧 File Structure

```
taskmanager/
├── index.html          # Semantic HTML markup
├── style.css           # Modern, responsive styles
├── script.js           # Vanilla JavaScript logic
└── README.md           # This file
```

## 💡 Advanced Features

### Keyboard Shortcuts

- **Enter** in task input → Add task

### Visual Feedback

- Real-time progress circle animation
- Hover states on all clickable elements
- Color transitions on completion
- Smooth checkbox scale on interaction

### Performance

- No DOM recalculation overhead
- Cached element references
- Efficient state-only re-renders
- Smooth 60fps animations

## 🎯 Limitations & Design Decisions

- **Max 20 tasks**: Intentional design choice to maintain focus
- **Monthly view only**: Simpler, cleaner interface
- **No task categories**: Minimal, distraction-free design
- **No recurring tasks**: Explicit tracking encourages consistency
- **No export**: Data remains local (can be exported via browser DevTools)

## 🤝 Contributing

Feel free to fork and customize! This is a great starter template for:

- Learning vanilla JavaScript
- Building offline-first web apps
- Implementing progress tracking features
- Practicing responsive design

## 📄 License

Free to use and modify for personal or commercial projects.

## 🎉 Tips for Success

1. **Start small**: Add 3-5 core habits/tasks to build momentum
2. **Daily review**: Check off completed tasks each evening
3. **Monthly reset**: Use the calendar to visualize progress patterns
4. **Consistent tracking**: The longer you track, the more valuable the data

---

**Built with ❤️ using vanilla web technologies**

Questions or feedback? Feel free to open an issue or contribute!
