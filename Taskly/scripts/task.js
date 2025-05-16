document.addEventListener('DOMContentLoaded', () => {
	let taskCounter = 0;

	const toDoListContainer = document.getElementById('toDoListContainer');
	const addTaskBtn = document.getElementById('addTaskBtn');

	// Load tasks from localStorage
	const loadTasks = () => {
		const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
		savedTasks.forEach(task => {
			renderTask(task);
			taskCounter++;
		});
	};

	// Save tasks to localStorage
	const saveTasks = () => {
		const tasks = Array.from(document.querySelectorAll('#toDoListContainer li')).map(li => {
			return {
				text: li.querySelector('.task').value,
				deadline: li.querySelector('.deadline').value,
				completed: li.querySelector('.checkbox').checked,
				priority: li.classList.contains('high-prio-task') ? 'high' :
				          li.classList.contains('medium-prio-task') ? 'medium' :
				          li.classList.contains('low-prio-task') ? 'low' : ''
			};
		});
		localStorage.setItem('tasks', JSON.stringify(tasks));
	};

	// Render a task item
	const renderTask = (task = {}) => {
		const { text = '', deadline = '', completed = false, priority = '' } = task;

		toDoListContainer.insertAdjacentHTML('beforeend', `
			<li data-index="${taskCounter}" class="${priority}-prio-task">
				<input class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
				<input class="task" value="${text}" placeholder="Enter task">
				<input class="deadline" type="datetime-local" value="${deadline}">
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

	// Add task
	const addTask = () => {
		renderTask();
		saveTasks();
	};

	// Remove task
	const removeTask = (event) => {
		const index = event.target.getAttribute('data-index');
		document.querySelector(`li[data-index="${index}"]`).remove();
		saveTasks();
	};

	// Mark task as complete/incomplete
	const toggleCompleteTask = (event) => {
		const checkbox = event.target;
		const taskElement = checkbox.closest('li').querySelector('.task');
		taskElement.classList.toggle('completed', checkbox.checked);
		saveTasks();
	};

	// Toggle priority selector
	const toggleTaskFilterOptions = (event) => {
		const taskFilterBtn = event.target;
		const taskFilterOptions = taskFilterBtn.closest('li').querySelector('.task-filter-options');
		taskFilterOptions.style.display = taskFilterOptions.style.display === 'none' ? 'block' : 'none';
	};

	// Change priority and background
	const changeBackgroundColor = (event) => {
	const btn = event.target;
	const priority = btn.getAttribute('data-priority');
	const li = btn.closest('li');

	const currentClass = `${priority}-prio-task`;

	// If task already has this priority, remove it (toggle off)
	if (li.classList.contains(currentClass)) {
		li.classList.remove('high-prio-task', 'medium-prio-task', 'low-prio-task');
	} else {
		// Apply new priority
		li.classList.remove('high-prio-task', 'medium-prio-task', 'low-prio-task');
		li.classList.add(currentClass);
	}

	saveTasks();
};

	// Filter tasks by priority
	const filterTasks = (priority) => {
		const tasks = document.querySelectorAll('#toDoListContainer li');
		tasks.forEach(task => {
			task.style.display = (priority === 'all' || task.classList.contains(`${priority}-prio-task`)) ? 'flex' : 'none';
		});
	};

	// Event bindings
	addTaskBtn.addEventListener('click', addTask);

	document.getElementById('toDoListContainer').addEventListener('click', (event) => {
		if (event.target.classList.contains('remove-task-button')) removeTask(event);
		if (event.target.classList.contains('task-filter')) toggleTaskFilterOptions(event);
		if (event.target.classList.contains('priority-btn')) changeBackgroundColor(event);
	});

	document.getElementById('toDoListContainer').addEventListener('change', (event) => {
		if (event.target.classList.contains('checkbox')) toggleCompleteTask(event);
		if (event.target.classList.contains('task') || event.target.classList.contains('deadline')) saveTasks();
	});

	document.querySelector('.filters').addEventListener('click', (event) => {
		if (event.target.hasAttribute('data-priority')) {
			const priority = event.target.getAttribute('data-priority');
			filterTasks(priority);
		} else if (event.target.classList.contains('all-filter-view')) {
			filterTasks('all');
		}
	});

	// Hide priority menu when clicking outside
	document.addEventListener('click', (event) => {
		document.querySelectorAll('.task-filter-options').forEach(options => {
			if (!options.contains(event.target) && !options.previousElementSibling.contains(event.target)) {
				options.style.display = 'none';
			}
		});
	});

	// Initialize
	loadTasks();
});
