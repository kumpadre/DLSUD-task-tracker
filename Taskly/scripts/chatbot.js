document.addEventListener("DOMContentLoaded", () => {
	const chatWidget = document.getElementById("chat-widget");
	const chatToggleBtn = document.getElementById("chat-toggle-btn");
	const chatCloseBtn = document.getElementById("chat-close-btn");
	const chatMessages = document.getElementById("chat-messages");
	const chatForm = document.getElementById("chat-form");
	const chatInput = document.getElementById("chat-input");
	const chatSendBtn = document.getElementById("chat-send-btn");

	// Open chat and focus input
	function openChat() {
		chatWidget.classList.add("open");
		chatWidget.setAttribute("aria-hidden", "false");
		chatInput.focus();
	}

	// Close chat and focus toggle button
	function closeChat() {
		chatWidget.classList.remove("open");
		chatWidget.setAttribute("aria-hidden", "true");
		chatToggleBtn.focus();
	}

	// Toggle chat open/close on button click
	chatToggleBtn.addEventListener("click", () => {
		if (chatWidget.classList.contains("open")) {
			closeChat();
		} else {
			openChat();
		}
	});

	// Close chat on close button click
	chatCloseBtn.addEventListener("click", closeChat);

	// Enable or disable send button based on input value
	chatInput.addEventListener("input", () => {
		chatSendBtn.disabled = chatInput.value.trim() === "";
	});

	// Scroll chat to bottom
	function scrollToBottom() {
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}

	// Add message to chat window with sender class ("ai" or "user")
	function addMessage(text, sender = "ai") {
		const msgDiv = document.createElement("div");
		msgDiv.classList.add("message", sender);
		msgDiv.textContent = text;
		chatMessages.appendChild(msgDiv);
		scrollToBottom();
	}

	// Generate simple AI responses based on keywords (using NLP library)
	function generateAIResponse(userInput) {
		const nlp = window.nlp;
		const doc = nlp(userInput.toLowerCase());
		const text = doc.text();

		if (doc.has('hello') || doc.has('hi') || doc.has('hey') || doc.has('good morning')) {
			return "Hello! 😊 Need help getting started with Taskly?";
		}
		if (text.match(/how (do|can) i/)) {
			return "You can add tasks, assign priorities, and view them on the calendar. Ask me about reminders or filters too!";
		}
		if (doc.has('help') || doc.has('assist') || doc.has('support')) {
			return "I'm here to help! You can ask about adding tasks, setting priorities, using the calendar, and more.";
		}
		if (text.includes("calendar") || text.includes("schedule") || text.includes("date") || text.includes("holiday")) {
			return "The calendar shows public holidays to help you plan better.";
		}
		if (text.includes("reminder") || text.includes("alert") || text.includes("notify") || text.includes("notification")) {
			return "Taskly can send you reminders for deadlines. Make sure notifications are enabled in your browser settings.";
		}
		if (text.includes("priority") || text.includes("important") || text.includes("urgent") || text.includes("high priority")) {
			return "You can mark tasks as low, medium, or high priority. Use the filter to view them easily.";
		}
		if (text.includes("filter") || text.includes("sort") || text.includes("view only") || text.includes("show me")) {
			return "You can filter tasks by priority. Just click the filter labels!";
		}
		if (text.includes("edit") || text.includes("update task") || text.includes("change task")) {
			return "Click on a task in the list to edit its title, due date, or priority.";
		}
		if (text.includes("login") || text.includes("sign up") || text.includes("sign in") || text.includes("account")) {
			return "Our account system checks if your signup and login credentials match. It's quick and simple!";
		}
		if (text.includes("thank") || text.includes("thanks") || text.includes("great") || text.includes("helpful")) {
			return "You're welcome! 😊 Let me know if you need anything else.";
		}
		if (text.includes("love taskly") || text.includes("awesome") || text.includes("like this app")) {
			return "That's great to hear! We're glad Taskly is working well for you 💙";
		}

		// Default fallback response
		return "I'm here to help! You can ask about adding tasks, setting reminders, using the calendar, or managing your account.";
	}

	// Handle chat form submission
	chatForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const userMessage = chatInput.value.trim();
		if (!userMessage) return;

		addMessage(userMessage, "user");
		chatInput.value = "";
		chatSendBtn.disabled = true;

		// Simulate AI response delay
		setTimeout(() => {
			const aiResponse = generateAIResponse(userMessage);
			addMessage(aiResponse, "ai");
		}, 800);
	});
});
