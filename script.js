// SELECT ELEMENTS
const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');

// VARS
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// 1st render
renderTodos();

// FORM SUBMIT
form.addEventListener('submit', function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

// SAVE TODO
function saveTodo() {
  const todoValue = todoInput.value;

  // check if the todo is empty
  const isEmpty = todoValue === '';

  // check for duplicate todos
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    showNotification("Todo's input is empty");
  } else if (isDuplicate) {
    showNotification('Todo already exists!');
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = '';
  }
}

// RENDER TODOS
function renderTodos() {
  if (todos.length === 0) {
    todosListEl.innerHTML = '<center>Nothing to do!</center>';
    return;
  }

  // CLEAR ELEMENT BEFORE A RE-RENDER
  todosListEl.innerHTML = '';

  // RENDER TODOS
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

// CLICK EVENT LISTENER FOR ALL THE TODOS
todosListEl.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  // t o d o id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // target action
  const action = target.dataset.action;

  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});

// CHECK A TODO
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// EDIT A TODO
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// DELETE TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  // re-render
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// SHOW A NOTIFICATION
function showNotification(msg) {
  // change the message
  notificationEl.innerHTML = msg;

  // notification enter
  notificationEl.classList.add('notif-enter');

  // notification leave
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}
