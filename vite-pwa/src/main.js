import './styles.css';
import { registerSW } from 'virtual:pwa-register';

const STORAGE_KEY = 'vite-pwa-todo-items';
const FILTERS = ['all', 'active', 'completed'];

const state = {
  todos: loadTodos(),
  filter: 'all',
};

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <section class="hero" aria-labelledby="app-title">
      <div>
        <p class="eyebrow">Offline-ready PWA</p>
        <h1 id="app-title">Todo App</h1>
        <p class="summary">Capture tasks, work through priorities, and keep everything available when the network drops.</p>
      </div>
      <button class="install-button" type="button" hidden>Install app</button>
    </section>

    <section class="panel" aria-label="Todo manager">
      <form class="todo-form">
        <label class="visually-hidden" for="todo-input">New todo</label>
        <input
          id="todo-input"
          name="todo"
          type="text"
          maxlength="120"
          placeholder="Add a task"
          autocomplete="off"
          required
        />
        <button type="submit">Add</button>
      </form>

      <div class="toolbar" aria-label="Todo filters">
        ${FILTERS.map(
          (filter) => `
            <button class="filter-button" type="button" data-filter="${filter}">
              ${capitalize(filter)}
            </button>
          `,
        ).join('')}
      </div>

      <ul class="todo-list" aria-live="polite"></ul>

      <footer class="footer">
        <span class="counter"></span>
        <button class="clear-button" type="button">Clear completed</button>
      </footer>
    </section>

    <div class="status-bar" role="status" aria-live="polite">
      <span class="network-status"></span>
      <button class="update-button" type="button" hidden>Update available</button>
    </div>
  </main>
`;

const form = app.querySelector('.todo-form');
const input = app.querySelector('#todo-input');
const list = app.querySelector('.todo-list');
const counter = app.querySelector('.counter');
const clearButton = app.querySelector('.clear-button');
const filterButtons = [...app.querySelectorAll('.filter-button')];
const installButton = app.querySelector('.install-button');
const networkStatus = app.querySelector('.network-status');
const updateButton = app.querySelector('.update-button');

let deferredInstallPrompt;
let updateServiceWorker;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  state.todos.unshift({
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  });

  input.value = '';
  saveAndRender();
});

list.addEventListener('click', (event) => {
  const todoItem = event.target.closest('[data-id]');

  if (!todoItem) {
    return;
  }

  const { id } = todoItem.dataset;

  if (event.target.matches('[data-action="delete"]')) {
    deleteTodo(id);
  }
});

list.addEventListener('change', (event) => {
  if (event.target.matches('[data-action="toggle"]')) {
    toggleTodo(event.target.closest('[data-id]').dataset.id);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    render();
  });
});

clearButton.addEventListener('click', () => {
  state.todos = state.todos.filter((todo) => !todo.completed);
  saveAndRender();
});

window.addEventListener('online', renderNetworkStatus);
window.addEventListener('offline', renderNetworkStatus);

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = undefined;
  installButton.hidden = true;
});

updateButton.addEventListener('click', () => {
  updateServiceWorker?.(true);
});

updateServiceWorker = registerSW({
  onNeedRefresh() {
    updateButton.hidden = false;
  },
  onOfflineReady() {
    networkStatus.textContent = 'Ready to work offline';
  },
});

render();
renderNetworkStatus();

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function saveAndRender() {
  saveTodos();
  render();
}

function render() {
  const visibleTodos = getVisibleTodos();
  const activeCount = state.todos.filter((todo) => !todo.completed).length;

  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === state.filter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  list.innerHTML = visibleTodos.length
    ? visibleTodos.map(renderTodo).join('')
    : `<li class="empty-state">No ${state.filter === 'all' ? '' : state.filter} tasks. Add one above.</li>`;

  counter.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;
  clearButton.disabled = !state.todos.some((todo) => todo.completed);
}

function renderTodo(todo) {
  return `
    <li class="todo-item ${todo.completed ? 'is-complete' : ''}" data-id="${todo.id}">
      <label>
        <input
          data-action="toggle"
          type="checkbox"
          ${todo.completed ? 'checked' : ''}
        />
        <span>${escapeHtml(todo.title)}</span>
      </label>
      <button data-action="delete" class="icon-button" type="button" aria-label="Delete ${escapeHtml(todo.title)}">
        &times;
      </button>
    </li>
  `;
}

function getVisibleTodos() {
  if (state.filter === 'active') {
    return state.todos.filter((todo) => !todo.completed);
  }

  if (state.filter === 'completed') {
    return state.todos.filter((todo) => todo.completed);
  }

  return state.todos;
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
  saveAndRender();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveAndRender();
}

function renderNetworkStatus() {
  networkStatus.textContent = navigator.onLine
    ? 'Online and synced locally'
    : 'Offline mode';
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}
