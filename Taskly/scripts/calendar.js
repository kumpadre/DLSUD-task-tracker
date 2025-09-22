// API key for Calendarific API
 const API_KEY = "yxllFsGHUawRvdQaGN9sNIrO4S7gO7hj";

// Fetch holidays for a given month and year
async function fetchHolidays(month, year = 2025) {
	const url = `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=PH&year=${year}&month=${month + 1}`;
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`API error: ${response.status}`);
		const data = await response.json();
		// Return array of holiday dates for the month
		return data.response.holidays.map(h => new Date(h.date.iso).getDate());
	} catch (error) {
		console.warn("Holiday API failed:", error);
		return []; // Fallback to empty array on error
	}
}

// Generate calendar weeks for a month and year (6 weeks, 7 days each)
function generateCalendarFromMonth(month, year) {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	const calendar = [];
	let currentDay = 1;
	let week = [];

	for (let i = 1; i <= 42; i++) {
		if (i <= firstDay.getDay()) {
			week.push('');
		} else if (currentDay <= lastDay.getDate()) {
			week.push(currentDay++);
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

// Return month name from zero-based index
function getMonthName(monthIndex) {
	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	return months[monthIndex];
}

// Render all 12 months calendars into the container
async function renderFullYearCalendars(year = 2025) {
	const container = document.getElementById('calendarScrollContainer');
	container.innerHTML = ''; // Clear existing content

	const now = new Date();
	const currentMonth = now.getMonth();

	for (let i = 0; i < 12; i++) {
		const calendar = generateCalendarFromMonth(i, year);
		const holidays = await fetchHolidays(i, year);

		const calendarWrapper = document.createElement('div');
		calendarWrapper.classList.add('calendar');
		calendarWrapper.id = `month-${i}`;

		const title = document.createElement('h3');
		title.textContent = `${getMonthName(i)} ${year}`;
		calendarWrapper.appendChild(title);

		const table = document.createElement('table');
		let html = '<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>';

		calendar.forEach(week => {
			html += '<tr>';
			week.forEach(day => {
				let cellClass = '';
				if (day === '') {
					cellClass = 'disabled';
				} else {
					if (i === currentMonth && day === now.getDate()) cellClass = 'today';
					if (holidays.includes(day)) cellClass += ' holiday';
				}
				html += `<td class="${cellClass.trim()}">${day}</td>`;
			});
			html += '</tr>';
		});

		table.innerHTML = html;
		calendarWrapper.appendChild(table);
		container.appendChild(calendarWrapper);
	}

	// Scroll to just before the current month for better visibility
	const targetMonth = Math.max(0, currentMonth - 1);
	const targetEl = document.getElementById(`month-${targetMonth}`);
	targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize calendars on DOM load
document.addEventListener('DOMContentLoaded', () => {
	renderFullYearCalendars(2025);
});

// Dark mode toggle listener
document.querySelector('.switch .input').addEventListener('change', (e) => {
	document.body.classList.toggle('dark-mode', e.target.checked);
});
