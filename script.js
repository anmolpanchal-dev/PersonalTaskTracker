const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

let tasks = ["","Exercise", "Study", "Reading"];
let selectedMonth = new Date().getMonth();
let year = new Date().getFullYear();

const monthSelect = document.getElementById("monthSelect");
const monthTitle = document.getElementById("monthTitle");
const tasksColumn = document.getElementById("tasksColumn");
const daysGrid = document.getElementById("daysGrid");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Month dropdown
monthNames.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.text = m;
  if (i === selectedMonth) opt.selected = true;
  monthSelect.appendChild(opt);
});

monthSelect.onchange = () => {
  selectedMonth = +monthSelect.value;
  render();
};

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function render() {
  tasksColumn.innerHTML = "";
  daysGrid.innerHTML = "";

  const days = daysInMonth(selectedMonth, year);
  monthTitle.innerText = `${monthNames[selectedMonth]} ${year}`;

  daysGrid.style.gridTemplateColumns = `repeat(${days}, 34px)`;

  // Day headers
  for (let d = 1; d <= days; d++) {
    const h = document.createElement("div");
    h.className = "day-header";
    h.innerHTML = `<div>${d}</div>`;
    daysGrid.appendChild(h);
  }

  // Tasks + radios
  tasks.forEach((task, row) => {
    const t = document.createElement("div");
    t.className = "task";
    t.innerText = task;
    tasksColumn.appendChild(t);

    for (let d = 1; d <= days; d++) {
      const cell = document.createElement("div");
      cell.className = "day-cell";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `day-${d}`; // 🔥 ek din me sirf ek task

      radio.onchange = updateProgress;

      cell.title = `${d} ${monthNames[selectedMonth]} ${year}`;
      cell.appendChild(radio);
      daysGrid.appendChild(cell);
    }
  });

  updateProgress();
}

function updateProgress() {
  const days = daysInMonth(selectedMonth, year);
  let completedDays = 0;

  for (let d = 1; d <= days; d++) {
    if (document.querySelector(`input[name="day-${d}"]:checked`)) {
      completedDays++;
    }
  }

  const percent = Math.round((completedDays / days) * 100);
  progressBar.style.width = percent + "%";
  progressText.innerText = `Progress: ${percent}%`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;
  tasks.push(input.value.trim());
  input.value = "";
  render();
}

render();
