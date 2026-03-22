// (Connecting JS to HTML)
const taskForm = document.getElementById('task-app');
const taskList = document.getElementById('task-display-area');
const taskNameInput = document.getElementById('task-name');
const categoryInput = document.getElementById('task-category');
const deadlineInput = document.querySelector('input[type="date"]');
const statusInput = document.getElementById('task-status');


let tasks = JSON.parse(localStorage.getItem('myTaskData')) || [];



taskForm.addEventListener('submit', function(event) {
    event.preventDefault(); // This stops the page from refreshing when click add

    // Create a "Task Object" - this groups all info about one task together
    const newTask = {
        id: Date.now(), // Unique ID based on the exact millisecond created
        name: taskNameInput.value,
        category: categoryInput.value,
        deadline: deadlineInput.value,
        status: statusInput.value || 'Todo'
    };

    tasks.push(newTask); // Add the new object to our array
    saveAndDisplay();    // Save to memory and show on screen
    taskForm.reset();    // Clear the input fields for the next task
});

// function takes our array and turns it into HTML on the screen
function renderTasks(tasksToDisplay = tasks) {
    taskList.innerHTML = ""; // Clear the list first so we don't get duplicates

    tasksToDisplay.forEach((task) => {
        const isOverdue = checkOverdue(task.deadline, task.status);
        
        // Create the list item
        const li = document.createElement('li');
        li.className = `task-card ${isOverdue ? 'overdue-border' : ''}`;
        
        li.innerHTML = `
            <div>
                <strong>${task.name}</strong> <small>(${task.category})</small><br>
                <span>Due: ${task.deadline}</span>
            </div>
            <div>
                <select onchange="updateStatus(${task.id}, this.value)">
                    <option value="Todo" ${task.status === 'Todo' ? 'selected' : ''}>To Do</option>
                    <option value="in Progress" ${task.status === 'in Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// 5. UPDATE & DELETE FUNCTIONS
function updateStatus(id, newStatus) {
    // Find the task with the matching ID and change its status
    tasks = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    saveAndDisplay();
}

function deleteTask(id) {
    // Filter out the task we want to delete
    tasks = tasks.filter(t => t.id !== id);
    saveAndDisplay();
}

// OVERDUE FUNCTION
function checkOverdue(deadline, status) {
    if (!deadline || status === 'Completed') return false;
    const today = new Date().setHours(0,0,0,0);
    const taskDate = new Date(deadline).setHours(0,0,0,0);
    return taskDate < today; // Returns true if the date is in the past
}

//  SAVING TO LOCAL STORAGE
function saveAndDisplay() {
    localStorage.setItem('myTaskData', JSON.stringify(tasks));
    renderTasks();
}

// show tasks when page first loads
renderTasks();



