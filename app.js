const STORAGE_KEY = "todos-fa";

let todos = loadTodos();
let currentFilter = "all";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const summary = document.getElementById("summary");
const clearDoneBtn = document.getElementById("clear-done");
const filterBtns = document.querySelectorAll(".filter-btn");

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function toPersianDigits(n) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function render() {
  list.innerHTML = "";

  const visible = todos.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  for (const todo of visible) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const check = document.createElement("button");
    check.className = "todo-check";
    check.textContent = "✓";
    check.setAttribute("aria-label", todo.done ? "علامت‌گذاری به‌عنوان انجام‌نشده" : "علامت‌گذاری به‌عنوان انجام‌شده");
    check.addEventListener("click", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "todo-delete";
    del.textContent = "🗑";
    del.setAttribute("aria-label", "حذف کار");
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(check, text, del);
    list.appendChild(li);
  }

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;

  emptyState.hidden = visible.length > 0;
  emptyState.textContent =
    todos.length === 0
      ? "هنوز کاری اضافه نکرده‌اید 🌱"
      : currentFilter === "done"
        ? "هنوز کاری انجام نشده است"
        : "همهٔ کارها انجام شده‌اند 🎉";

  summary.textContent =
    todos.length === 0
      ? "امروز چه کاری انجام می‌دهید؟"
      : `${toPersianDigits(remaining)} کار باقی‌مانده از ${toPersianDigits(todos.length)} کار`;

  clearDoneBtn.hidden = doneCount === 0;
}

function addTodo(text) {
  todos.unshift({ id: Date.now(), text, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  saveTodos();
  render();
});

render();
