const todoForm= document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})

function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length>0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObjecct);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }

}

