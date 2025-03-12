let taskCounter = 1;

// Add task function
const addTask = () => {
	const toDoListContainer = document.getElementById('toDoListContainer');

	toDoListContainer.innerHTML += `
			<li data-index="${taskCounter}">
				<div>
					<input class="checkbox" type="checkbox">
					<input class="task" placeholder="Enter task">
					<button class="remove-task-button" data-index="${taskCounter}">✖</button>
			</li>
    `;

	// Add event listener to the new checkbox
	const newCheckbox = toDoListContainer.querySelector(`li[data-index="${taskCounter}"] .checkbox`);
  newCheckbox.addEventListener('change', toggleCompleteTask);

	// Add event listener to the new removeButton
	const newRemoveBtn = toDoListContainer.querySelector(`li[data-index="${taskCounter}"] .remove-task-button`);
	newRemoveBtn.addEventListener('click', removeTask);

	// const newTaskFilterBtn = toDoListContainer.querySelector(`li[data-index="${taskCounter}"] .task-filter`);
	// newTaskFilterBtn.addEventListener('click', toggleTaskFilterOptions);
  
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

// Adds line through when checkbox is checked
const toggleCompleteTask = (event) => {
	const checkbox = event.target;
	const taskElement = checkbox.closest('li').querySelector('.task');
	if (checkbox.checked) {
			taskElement.classList.add('completed');
	} else {
			taskElement.classList.remove('completed');
	}
}

// Event delegation for remove buttons
document.getElementById('toDoListContainer').addEventListener('click', (event) => {
	if (event.target.classList.contains('remove-task-button')) {
			removeTask(event);
	}
});

// Event delegation for checkboxes
document.getElementById('toDoListContainer').addEventListener('change', (event) => {
	if (event.target.classList.contains('checkbox')) {
			toggleCompleteTask(event);
	}
});

/*
// Event delegation for task filter buttons
document.getElementById('toDoListContainer').addEventListener('click', (event) => {
	if (event.target.classList.contains('task-filter')) {
			toggleTaskFilterOptions(event);
	}
});

// Toggle task filter options visibility
const toggleTaskFilterOptions = (event) => {
	const taskFilterBtn = event.target;
	const taskFilterOptions = taskFilterBtn.nextElementSibling;
	taskFilterOptions.style.display = taskFilterOptions.style.display === 'none' ? 'block' : 'none';
}
*/