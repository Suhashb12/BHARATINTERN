// Sample user data (replace with real user data)
const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
];

// Sample task data (replace with real tasks)
const tasks = [
    { id: 1, name: 'Task 1', assignee: 'User 1' },
    { id: 2, name: 'Task 2', assignee: 'User 2' },
];

function populateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user.name;
        userList.appendChild(li);
    });

    // Populate the assignee dropdown in the "Add Task" section
    const assigneeSelect = document.getElementById('assignee');
    assigneeSelect.innerHTML = '';
    users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        assigneeSelect.appendChild(option);
    });
}

function populateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = `${task.name} (Assignee: ${task.assignee})`;
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskNameInput = document.getElementById('task-name');
    const assigneeSelect = document.getElementById('assignee');
    const taskName = taskNameInput.value;
    const assigneeId = assigneeSelect.value;

    if (!taskName || !assigneeId) {
        alert('Please enter task name and select an assignee.');
        return;
    }

    const assignee = users.find((user) => user.id == assigneeId);
    tasks.push({ id: tasks.length + 1, name: taskName, assignee: assignee.name });

    // Clear input fields
    taskNameInput.value = '';
    assigneeSelect.selectedIndex = 0;

    // Repopulate the task list
    populateTaskList();
}

// Initial population of user and task lists
populateUserList();
populateTaskList();
