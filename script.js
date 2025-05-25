document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const clearAllBtn = document.getElementById('clear-all');
  const prioritySelect = document.getElementById('priority-select');
  const categorySelect = document.getElementById('category-select');
  const filterCategory = document.getElementById('filter-category');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentCategoryFilter = 'all';

  tasks.forEach(renderTask);

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
      id: Date.now(),
      text,
      completed: false,
      priority: prioritySelect.value,
      category: categorySelect.value
    };

    tasks.push(task);
    updateStorage();
    renderTask(task);
    taskInput.value = '';
  });

  filterCategory.addEventListener('change', () => {
    currentCategoryFilter = filterCategory.value;
    refreshTasks();
  });

  clearAllBtn.addEventListener('click', () => {
    if (!confirm('Delete all tasks?')) return;
    tasks = [];
    updateStorage();
    refreshTasks();
  });

  function renderTask(task) {
    if (currentCategoryFilter !== 'all' && task.category !== currentCategoryFilter) return;

    const li = document.createElement('li');
    li.classList.add(`priority-${task.priority}`);
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = `${task.text} (${task.category})`;
    span.title = 'Click to complete, double-click to edit';
    span.addEventListener('click', () => toggleComplete(task.id));
    span.addEventListener('dblclick', () => editTask(span, task.id));

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(span, delBtn);
    taskList.appendChild(li);
  }

  function toggleComplete(id) {
    const task = tasks.find(t => t.id == id);
    task.completed = !task.completed;
    updateStorage();
    refreshTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id != id);
    updateStorage();
    refreshTasks();
  }

  function editTask(span, id) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent.split(' (')[0];
    input.className = 'edit-input';

    input.addEventListener('blur', () => {
      const task = tasks.find(t => t.id == id);
      task.text = input.value.trim() || task.text;
      updateStorage();
      refreshTasks();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') input.blur();
      if (e.key === 'Escape') refreshTasks();
    });

    span.replaceWith(input);
    input.focus();
  }

  function refreshTasks() {
    taskList.innerHTML = '';
    tasks.forEach(renderTask);
  }

  function updateStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});
