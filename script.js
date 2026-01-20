const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Render tasks based on filter
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    // Left side: checkbox + text
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("task-left");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(index));

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    // Right side: buttons
    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit");
    editBtn.addEventListener("click", () => editTask(index));

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Del";
    deleteBtn.addEventListener("click", () => deleteTask(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  updateCount();
  saveTasks();
}

// Add task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return; // prevent empty tasks

  tasks.push({ text, completed: false });
  taskInput.value = "";
  renderTasks();
}

// Toggle completed
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Edit task
function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

// Clear completed tasks
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
}

// Update task count
function updateCount() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCount.textContent = `${total} tasks (${completed} completed)`;
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter handling
filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Keyboard support
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// Button events
addBtn.addEventListener("click", addTask);
clearCompletedBtn.addEventListener("click", clearCompleted);

// Initial render
renderTasks();
