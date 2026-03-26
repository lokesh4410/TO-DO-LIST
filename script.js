// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filters button");

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
  list.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  emptyState.style.display = filteredTasks.length ? "none" : "block";

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.tabIndex = 0;

    // Toggle complete
    span.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    span.addEventListener("keypress", (e) => {
      if (e.key === "Enter") span.click();
    });

    // Actions
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = () => editTask(task.id);

    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.append(editBtn, deleteBtn);
    li.append(span, actions);
    list.appendChild(li);
  });
}

// Add Task
form.addEventListener("submit", e => {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    text: input.value.trim(),
    completed: false
  };

  tasks.push(newTask);
  input.value = "";
  saveTasks();
  renderTasks();
});

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);

  if (newText !== null) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Filter Tasks
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

// Initial Render
renderTasks();