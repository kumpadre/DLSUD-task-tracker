// Request notification permission from the user
if ('Notification' in window && Notification.permission !== 'granted') {
	Notification.requestPermission();
}

// Keep track of already notified tasks and holidays
const notifiedTasks = new Set();
const notifiedHolidays = new Set();

// Global storage for fetched 2025 holidays (formatted as 'YYYY-MM-DD')
let allHolidays2025 = [];

// Fetch Philippine holidays for 2025 using Calendarific API
async function fetchAllHolidays2025() {
	const API_KEY = "0wGd1BoVenM2uz4Lx5Vznh6RczOAtDBv";

	try {
		const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=PH&year=2025`);
		const data = await response.json();

		// Extract and store the date portion only
		allHolidays2025 = data.response.holidays.map(h => h.date.iso.split("T")[0]);

		// === For testing: fake holiday tomorrow ===
		// allHolidays2025.push(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
	} catch (error) {
		console.warn("Failed to fetch holidays:", error);
	}
}

// Initial fetch on page load
fetchAllHolidays2025();

// --- Repeated reminder checks every 10 seconds ---
setInterval(() => {
	const now = new Date();

	// === Reminder for unsaved task deadline input ===
	const taskDeadlineInput = document.getElementById('taskDeadline');
	const taskTitleInput = document.querySelector('.title-area input');

	if (taskDeadlineInput && taskDeadlineInput.value) {
		const deadline = new Date(taskDeadlineInput.value);
		const taskText = taskTitleInput?.value || "Untitled Task";
		const timeDiff = deadline - now;
		const taskKey = `unsaved-${taskDeadlineInput.value}`; // Unique key for unsaved task

		if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000 && !notifiedTasks.has(taskKey)) {
			showCustomNotification(`⏰ Task Reminder: ${taskText}`);
			notifiedTasks.add(taskKey);
		}
	}

	// === Reminders for saved task list ===
	document.querySelectorAll('#toDoListContainer li').forEach(taskItem => {
		const deadlineInput = taskItem.querySelector('.deadline');
		const taskTextInput = taskItem.querySelector('.task');

		if (deadlineInput && taskTextInput) {
			const deadline = new Date(deadlineInput.value);
			const taskText = taskTextInput.value || "Untitled Task";
			const timeDiff = deadline - now;
			const taskKey = `${taskItem.dataset.index}-${deadlineInput.value}`; // Unique per task+time

			if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000 && !notifiedTasks.has(taskKey)) {
				showCustomNotification(`⏰ Task Reminder: ${taskText}`);
				notifiedTasks.add(taskKey);
			}
		}
	});

	// === Reminder for upcoming holidays ===
	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1); // Add one day

	const yyyy = tomorrow.getFullYear();
	const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
	const dd = String(tomorrow.getDate()).padStart(2, '0');
	const tomorrowStr = `${yyyy}-${mm}-${dd}`;

	// Show holiday reminder if tomorrow is a holiday
	if (allHolidays2025.includes(tomorrowStr) && !notifiedHolidays.has(tomorrowStr)) {
		showCustomNotification(`🎉 Reminder: Holiday tomorrow (${tomorrowStr})`);
		notifiedHolidays.add(tomorrowStr);
	}
}, 10000); // Run every 10 seconds

// Show an in-app custom notification
function showCustomNotification(message) {
	const notifBox = document.getElementById('customNotification');
	document.getElementById('notificationText').textContent = message;
	notifBox.classList.remove('hidden');
	setTimeout(() => notifBox.classList.add('hidden'), 5000); // Auto-hide after 5 sec
}
