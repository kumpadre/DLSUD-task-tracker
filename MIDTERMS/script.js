document.addEventListener('DOMContentLoaded', () => {
	let taskCounter = 1;

	// Add task function
	const addTask = () => {
			const toDoListContainer = document.getElementById('toDoListContainer');

			toDoListContainer.insertAdjacentHTML('beforeend', `
					<li data-index="${taskCounter}">
							<input class="checkbox" type="checkbox">
							<input class="task" placeholder="Enter task">
							<button class="remove-task-button" data-index="${taskCounter}">✖</button>
							<button class="task-filter">⋮</button>
							<div class="task-filter-options" data-index="${taskCounter}" style="display: none;">
									<span><button class="priority-btn" data-priority="high">High</button></span>
									<span><button class="priority-btn" data-priority="medium">Medium</button></span>
									<span><button class="priority-btn" data-priority="low">Low</button></span>
							</div>
					</li>
			`);

			taskCounter++;
	};

	const addTaskBtn = document.getElementById('addTaskBtn');
	addTaskBtn.addEventListener('click', addTask);

	// Remove task function
	const removeTask = (event) => {
			const currentRemoveTaskBtn = event.target;
			const removeTaskIndex = currentRemoveTaskBtn.getAttribute('data-index');
			const removeTaskElement = document.querySelector(`li[data-index="${removeTaskIndex}"]`);
			
			removeTaskElement.remove();
			updateIndices();
	};

	// Update indices function
	const updateIndices = () => {
			const taskList = document.querySelectorAll('#toDoListContainer li');
			taskCounter = 0;

			taskList.forEach((task) => {
					task.setAttribute('data-index', taskCounter);
					task.querySelector('.remove-task-button').setAttribute('data-index', taskCounter);
					taskCounter++;
			});
	};

	// Function to add line through when checkbox is checked
	const toggleCompleteTask = (event) => {
			const checkbox = event.target;
			const taskElement = checkbox.closest('li').querySelector('.task');
			if (checkbox.checked) {
					taskElement.classList.add('completed');
			} else {
					taskElement.classList.remove('completed');
			}
	};

	// Toggle task filter options visibility
	const toggleTaskFilterOptions = (event) => {
			const taskFilterBtn = event.target;
			const taskFilterOptions = taskFilterBtn.closest('li').querySelector('.task-filter-options');
			taskFilterOptions.style.display = taskFilterOptions.style.display === 'none' ? 'block' : 'none';
	};

	// Hide task filter options when clicking outside
	document.addEventListener('click', (event) => {
			const taskFilterOptions = document.querySelectorAll('.task-filter-options');
			taskFilterOptions.forEach((options) => {
					if (!options.contains(event.target) && !options.previousElementSibling.contains(event.target)) {
							options.style.display = 'none';
					}
			});
	});

	// Function to change the background color of the li element
	const changeBackgroundColor = (event) => {
			const priorityBtn = event.target;
			const priority = priorityBtn.getAttribute('data-priority');
			const liElement = priorityBtn.closest('li');

			const hasHighPrio = liElement.classList.contains('high-prio-task');
			const hasMediumPrio = liElement.classList.contains('medium-prio-task');
			const hasLowPrio = liElement.classList.contains('low-prio-task');

			// Remove existing priority classes
			liElement.classList.remove('high-prio-task', 'medium-prio-task', 'low-prio-task');

			if (priority === 'high' && !hasHighPrio) {
					liElement.classList.add('high-prio-task');
			} else if (priority === 'medium' && !hasMediumPrio) {
					liElement.classList.add('medium-prio-task');
			} else if (priority === 'low' && !hasLowPrio) {
					liElement.classList.add('low-prio-task');
			}
	};

	// Function to filter tasks based on priority
	const filterTasks = (priority) => {
			const tasks = document.querySelectorAll('.to-do-list-container li');
			tasks.forEach(task => {
					task.style.display = 'none'; // Hide all tasks
					if (priority === 'all' || task.classList.contains(`${priority}-prio-task`) || !task.querySelector('.priority-btn')){
							task.style.display = 'flex'; // Show tasks that match the priority
					}
			});
	};

	// Event delegation for priority buttons
	document.getElementById('toDoListContainer').addEventListener('click', (event) => {
			if (event.target.classList.contains('priority-btn')) {
					changeBackgroundColor(event);
			}
	});

	// Event delegation for filter buttons
	document.querySelector('.filters').addEventListener('click', (event) => {
			if (event.target.hasAttribute('data-priority')) {
					const priority = event.target.getAttribute('data-priority');
					filterTasks(priority);
				} else if (event.target.classList.contains('all-filter-view')) {
					filterTasks('all');
			}
	});

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

	// Event delegation for task filter buttons
	document.getElementById('toDoListContainer').addEventListener('click', (event) => {
			if (event.target.classList.contains('task-filter')) {
					toggleTaskFilterOptions(event);
			}
	});
});