document.addEventListener('DOMContentLoaded', () => {
	let taskCounter = 1;

	if (Notification.permission !== "granted" && Notification.permission !== "denied") {
	Notification.requestPermission();
	}	

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
//########################################## NOTIFICATION #############################################################

	// Request notification permission
	if ('Notification' in window && Notification.permission !== 'granted') {
		Notification.requestPermission();
	}

	// Reminder notification logic
	const notifiedTasks = new Set(); // Keep track of notified tasks
	
	setInterval(() => {
		const now = new Date();
	
		document.querySelectorAll('#toDoListContainer li').forEach(taskItem => {
			const deadlineInput = taskItem.querySelector('.deadline');
			const taskTextInput = taskItem.querySelector('.task');
	
			if (deadlineInput && taskTextInput) {
				const deadline = new Date(deadlineInput.value);
				const taskText = taskTextInput.value || "Untitled Task";
				const timeDiff = deadline - now;
	
				if (timeDiff > 0 && timeDiff <= 10 * 60 * 1000) { // 10 minutes
					const taskKey = `${taskItem.dataset.index}-${deadlineInput.value}`;
	
					if (!notifiedTasks.has(taskKey)) {
						if (Notification.permission === "granted") {
							new Notification("⏰ Task Reminder!", {
								body: taskText,
								icon: "images/todo.png" // Optional icon
							});
							notifiedTasks.add(taskKey);
						}
					}
				}
			}
		});
	}, 30000); // Check every 30 seconds

//########################################## CALENDAR #############################################################

// Function to get the month name from a Date object
function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

function generateCalendar(monthOffset) {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthOffset);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const calendar = [];
    let currentDay = 1;
    let week = [];
    for (let i = 1; i <= 42; i++) { // Create 6 weeks (7 days each)
        const dayOfWeek = new Date(year, month, currentDay).getDay();
        if (i <= firstDay.getDay()) {
            week.push('');
        } else if (currentDay <= lastDay.getDate()) {
            week.push(currentDay);
            currentDay++;
        } else {
            week.push('');
        }
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }

    return calendar;
}

function renderCalendar(calendar, element, monthOffset) {
    let html = '<tr>';
    html += '<th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th>';
    html += '</tr>';

    const today = new Date();
    const currentMonth = today.getMonth(); // Get the current month
    const currentDate = today.getDate();   // Get today's date

    calendar.forEach(week => {
        html += '<tr>';
        week.forEach(day => {
            let cellClass = '';

            if (day === '') {
                cellClass = 'disabled';
            } else {
                if (monthOffset === 0 && day === currentDate) {
                    // Highlight today's date only in the current month
                    cellClass = 'today';
                }
            }

            html += `<td class="${cellClass}">${day}</td>`;
        });
        html += '</tr>';
    });

    element.innerHTML = html;
}

function updateCalendars() {
    const prevMonth = generateCalendar(-1);  // Previous Month
    const currentMonth = generateCalendar(0); // Current Month
    const nextMonth = generateCalendar(1);   // Next Month

    // Set dynamic month names for titles
    document.getElementById('prevMonthTitle').textContent = getMonthName(new Date().getMonth() - 1) + ' ' + new Date().getFullYear();
    document.getElementById('currentMonthTitle').textContent = getMonthName(new Date().getMonth()) + ' ' + new Date().getFullYear();
    document.getElementById('nextMonthTitle').textContent = getMonthName(new Date().getMonth() + 1) + ' ' + new Date().getFullYear();

    // Render the calendars
    renderCalendar(prevMonth, document.getElementById('prevMonthTable'), -1);
    renderCalendar(currentMonth, document.getElementById('currentMonthTable'), 0);
    renderCalendar(nextMonth, document.getElementById('nextMonthTable'), 1);
}

// Initialize the calendars
updateCalendars();

document.addEventListener("DOMContentLoaded", () => {
	const chatWidget = document.getElementById("chat-widget");
	const chatToggleBtn = document.getElementById("chat-toggle-btn");
	const chatCloseBtn = document.getElementById("chat-close-btn");
	const chatMessages = document.getElementById("chat-messages");
	const chatForm = document.getElementById("chat-form");
	const chatInput = document.getElementById("chat-input");
	const chatSendBtn = document.getElementById("chat-send-btn");
  
	// Open and close chat
	function openChat() {
	  chatWidget.classList.add("open");
	  chatWidget.setAttribute("aria-hidden", "false");
	  chatInput.focus();
	}
	function closeChat() {
	  chatWidget.classList.remove("open");
	  chatWidget.setAttribute("aria-hidden", "true");
	  chatToggleBtn.focus();
	}
  
	chatToggleBtn.addEventListener("click", () => {
	  if (chatWidget.classList.contains("open")) {
		closeChat();
	  } else {
		openChat();
	  }
	});
	chatCloseBtn.addEventListener("click", closeChat);
  
	// Enable Send button based on input
	chatInput.addEventListener("input", () => {
	  chatSendBtn.disabled = chatInput.value.trim() === "";
	});
  
	function scrollToBottom() {
	  chatMessages.scrollTop = chatMessages.scrollHeight;
	}
  
	// Add message to chat window
	function addMessage(text, sender = "ai") {
	  const msgDiv = document.createElement("div");
	  msgDiv.classList.add("message", sender);
	  msgDiv.textContent = text;
	  chatMessages.appendChild(msgDiv);
	  scrollToBottom();
	}
  
//########################################## HELPER BOT #############################################################
	function generateAIResponse(userInput) {
	  userInput = userInput.trim().toLowerCase();
	  if (userInput.includes("hello") || userInput.includes("hi")) {
		return "Hello! How can I assist you with Taskly today?";
	  }
	  if (
		userInput.includes("help") ||
		userInput.includes("how to") ||
		userInput.includes("usage")
	  ) {
		return "You can add tasks by typing in the input box with the selected date, assign priority, and mark tasks completed. Click dates on the calendar to view or add tasks for that specific day.";
	  }
	  if (userInput.includes("thank")) {
		return "You're very welcome! Happy task managing 😊";
	  }
	  return "I'm here to help! Ask me anything about managing your tasks.";
	}
  
	// Handle form submit
	chatForm.addEventListener("submit", (e) => {
	  e.preventDefault();
	  const userMessage = chatInput.value.trim();
	  if (!userMessage) return;
  
	  addMessage(userMessage, "user");
	  chatInput.value = "";
	  chatSendBtn.disabled = true;
  
	  setTimeout(() => {
		const aiResponse = generateAIResponse(userMessage);
		addMessage(aiResponse, "ai");
	  }, 800);
	});
  });