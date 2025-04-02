const todoForm = document.querySelector('form');
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
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }  
}
function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=>{
        todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })
}
function createTodoItem(todo, todoIndex){
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })
    checkbox.checked = todo.completed;
    return todoLI;
}
function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}
function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const colorButtons = document.querySelectorAll('.color-btn');

// Load saved theme and color
const savedTheme = localStorage.getItem('theme') || 'light';
const savedColor = localStorage.getItem('color') || 'default';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
applyColorTheme(savedColor);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
    // Reapply the current color theme when switching modes
    applyColorTheme(localStorage.getItem('color') || 'default');
});

// Color theme buttons
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.getAttribute('data-color');
        applyColorTheme(color);
        localStorage.setItem('color', color);
    });
});

function applyColorTheme(color) {
    const colors = {
        default: {
            light: '#4a90e2',
            dark: '#64b5f6'
        },
        blue: {
            light: '#4a90e2',
            dark: '#64b5f6'
        },
        green: {
            light: '#2ecc71',
            dark: '#2ecc71'
        },
        purple: {
            light: '#9b59b6',
            dark: '#9b59b6'
        }
    };

    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const colorValue = colors[color][currentTheme];
    
    // Apply the color theme
    document.documentElement.style.setProperty('--primary-color', colorValue);
    
    // Update accent color based on the theme
    const accentColor = currentTheme === 'dark' ? '#00FFC4' : '#00FFC4';
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Update hover state for accent color
    const accentHover = currentTheme === 'dark' ? '#00e6b3' : '#00e6b3';
    document.documentElement.style.setProperty('--accent-hover', accentHover);
}

// Pomodoro Timer
class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.currentMode = 'pomodoro';
        
        this.display = document.querySelector('.timer-display');
        this.startBtn = document.getElementById('start-timer');
        this.pauseBtn = document.getElementById('pause-timer');
        this.resetBtn = document.getElementById('reset-timer');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentMode = button.textContent.toLowerCase();
                this.reset();
            });
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.updateTimer(), 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        const minutes = parseInt(document.querySelector('.mode-btn.active').getAttribute('data-time'));
        this.timeLeft = minutes * 60;
        this.updateDisplay();
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.pause();
            this.playNotification();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    playNotification() {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
    }
}

// Initialize Pomodoro Timer
const pomodoroTimer = new PomodoroTimer();

// Notes functionality
const notesInput = document.getElementById('notes-input');
const saveNotesBtn = document.getElementById('save-notes');
const saveStatus = document.getElementById('save-status');
const notesSection = document.querySelector('.notes-section');
const toggleNotesBtn = document.getElementById('toggle-notes');

// Load saved notes and collapsed state
const savedNotes = localStorage.getItem('studyNotes') || '';
const isCollapsed = localStorage.getItem('notesCollapsed') === 'true';
notesInput.value = savedNotes;
if (isCollapsed) {
    notesSection.classList.add('collapsed');
}

// Toggle notes section
toggleNotesBtn.addEventListener('click', () => {
    notesSection.classList.toggle('collapsed');
    localStorage.setItem('notesCollapsed', notesSection.classList.contains('collapsed'));
});

// Auto-save functionality
let autoSaveTimeout;
notesInput.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveNotes();
    }, 1000);
});

// Manual save button
saveNotesBtn.addEventListener('click', () => {
    saveNotes();
});

function saveNotes() {
    const notes = notesInput.value;
    localStorage.setItem('studyNotes', notes);
    saveStatus.textContent = 'Notes saved!';
    saveStatus.style.opacity = '1';
    
    // Hide the save status after 2 seconds
    setTimeout(() => {
        saveStatus.style.opacity = '0';
    }, 2000);
}

