// elements
const todoform = document.getElementById('todoform');
const newtodo = document.getElementById('newtodo');
const todosList = document.getElementById('todos-list');

// vars
let todos = [];
let tempTodoId = '';

// load local storage if there is any
if (localStorage.getItem('todos')) {
  todos = JSON.parse(localStorage.getItem('todos'));
  renderTodos();
}

// listen to form submission
todoform.addEventListener('submit', function (e) {
  e.preventDefault();

  // save to do
  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

// add even listener to todos
todosList.addEventListener('click', (e) => {
  const target = e.target;

  const todo = target.parentNode;
  if (todo.className !== 'todo') return;

  const todoId = Number(todo.id);
  const action = target.dataset.action;

  action === 'check' &&
    (todos = todos.map((todo, index) => ({
      ...todo,
      checked: index === todoId ? !todo.checked : todo.checked,
    })));

  action === 'delete' && (todos = todos.filter((todo, index) => index !== todoId)) && (tempTodoId = '');

  action === 'edit' && (newtodo.value = todos[todoId].value) && (tempTodoId = todoId);

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});
// save new todo
function saveTodo() {
  if (!newtodo.value) {
    showNotification("todo's empty!");
  } else if (todos.findIndex((todo) => todo.value.toUpperCase() === newtodo.value.toUpperCase()) >= 0) {
    showNotification('Duplicate todo');
  } else {
    if (tempTodoId !== '') {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === tempTodoId ? newtodo.value : todo.value,
      }));
      tempTodoId = '';
    } else {
      todos.unshift({
        value: newtodo.value,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
    newtodo.value = '';
  }
}

// render todos
function renderTodos() {
  if (!todos.length) {
    todosList.innerHTML = '<center>Nothing to do</center>';
    return;
  }

  todosList.innerHTML = '';
  todos.forEach((todo, index) => {
    todosList.innerHTML += `<div class="todo" id='${index}'>
                                <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
                                style="color : ${todo.color}"
                                data-action="check"></i>
                                
                                <p class="${todo.checked ? 'checked' : ''}" data-action="check">
                                    ${todo.value}
                                </p>

                                <i class="bi bi-pencil-square" data-action="edit"></i>

                                <i class="bi bi-trash" data-action="delete"></i>
                            </div>`;
  });
}

function showNotification(message) {
  const notifEl = document.querySelector('.notification');

  // show message
  notifEl.innerHTML = message;

  notifEl.classList.add('notif-enter');

  setTimeout(() => {
    notifEl.classList.remove('notif-enter');
  }, 2000);
}
