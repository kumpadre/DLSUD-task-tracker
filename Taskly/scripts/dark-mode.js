document.addEventListener("DOMContentLoaded", () => {
	const darkModeToggle = document.querySelector('.switch .input');
	const body = document.body;

	// Apply saved dark mode preference on load
	if (localStorage.getItem('darkMode') === 'enabled') {
		body.classList.add('dark-mode');
		darkModeToggle.checked = true;
	}

	// Toggle dark mode on switch change
	darkModeToggle.addEventListener('change', () => {
		if (darkModeToggle.checked) {
			body.classList.add('dark-mode');
			localStorage.setItem('darkMode', 'enabled');
		} else {
			body.classList.remove('dark-mode');
			localStorage.setItem('darkMode', 'disabled');
		}
	});
});
