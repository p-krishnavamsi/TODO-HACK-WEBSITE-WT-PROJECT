const apiUrl = 'http://localhost:5000/tasks';

function fetchTasks() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((tasks) => {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = ''; 

      tasks.forEach((task) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        taskItem.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Status: ${task.completed ? 'Completed' : 'Pending'}</p>
          <p><strong>Scheduled at:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
          <button class="complete-btn" onclick="toggleCompletion('${task._id}', ${task.completed})">
            Mark as ${task.completed ? 'Pending' : 'Completed'}
          </button>
          <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
        `;

        taskList.appendChild(taskItem);
      });
    })
    .catch((error) => console.error('Error fetching tasks:', error));
}

function addTask() {
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  console.log("in the add task module");

  if (!title || !description) {
    alert('Please fill in all fields');
    return;
  }

  const newTask = { title, description, completed: false };

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  })
    .then((response) => response.json())
    .then(() => {
      fetchTasks(); 
      document.getElementById('task-title').value = ''; 
      document.getElementById('task-description').value = '';
    })
    .catch((error) => console.error('Error adding task:', error));
}

function deleteTask(taskId) {
  fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' })
    .then(() => fetchTasks()) 
    .catch((error) => console.error('Error deleting task:', error));
}

function toggleCompletion(taskId, currentStatus) {
  fetch(`${apiUrl}/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !currentStatus }),
  })
    .then(() => fetchTasks()) 
    .catch((error) => console.error('Error updating task:', error));
}

window.onload = fetchTasks;
