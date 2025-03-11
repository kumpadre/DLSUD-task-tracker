// Add task function
let taskCounter = 1;

const addTask = () => {
	const toDoListContainer = document.getElementById('toDoListContainer');

	toDoListContainer.innerHTML += `
		<li data-index="${taskCounter}">
			<div>
				<input class="checkbox" type="checkbox">
				<input class="task" placeholder="Enter task">
				<button class="remove-task-button" id="removeTaskBtn" data-index="${taskCounter}">✖</button>
			</div>
		</li>
	`;
	taskCounter++;
}

const addTaskBtn = document.getElementById('addTaskBtn');
addTaskBtn.addEventListener('click', addTask);

// Remove task function
const removeTask = (event) => {
	const currentRemoveTaskBtn = event.target;
	const removeTaskIndex = currentRemoveTaskBtn.getAttribute('data-index');
	const removeTaskElement = document.querySelector(`li[data-index="${removeTaskIndex}"]`);
	
	removeTaskElement.remove()
	updateIndices();
}

// Update indices function
const updateIndices = () => {
	const taskList = document.querySelectorAll('#toDoListContainer li');
	taskCounter = 0;

	taskList.forEach((task) => {
		task.setAttribute('data-index', taskCounter);
		task.querySelector('.remove-task-button').setAttribute('data-index', taskCounter);
		taskCounter++;
	});
}

const toDoListContainer = document.getElementById('toDoListContainer');
toDoListContainer.addEventListener('click', removeTask);
