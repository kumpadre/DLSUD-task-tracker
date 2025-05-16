const allowedDomains = ["@gmail.com", "@yahoo.com", "@dlsud.edu.ph"];

// Check if email ends with allowed domain
function isValidEmailDomain(email) {
  return allowedDomains.some(domain => email.endsWith(domain));
}

// SIGNUP form handling
document.getElementById("signupForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!isValidEmailDomain(email)) {
    alert("Email must be from @gmail.com, @yahoo.com, or @dlsud.edu.ph.");
    return;
  }

  if (localStorage.getItem(email)) {
    alert("Email already exists. Please log in.");
    return;
  }

  localStorage.setItem(email, JSON.stringify({ email, password }));
  alert("Signup successful! You can now log in.");
  window.location.href = "login.html";
});

// LOGIN form handling
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!isValidEmailDomain(email)) {
    alert("Email must be from @gmail.com, @yahoo.com, or @dlsud.edu.ph.");
    return;
  }

  const userData = JSON.parse(localStorage.getItem(email));
  if (!userData) {
    alert("Email does not exist.");
  } else if (userData.password !== password) {
    alert("Incorrect password.");
  } else {
    alert("Login successful!");
    window.location.href = "task.html";
  }
});

// FORGOT PASSWORD form handling
document.getElementById('forgotPasswordForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value.trim();
  const newPassword = document.getElementById('newPassword').value;

  const userData = JSON.parse(localStorage.getItem(email));
  if (!userData) {
    alert("Email does not exist.");
    return;
  }

  userData.password = newPassword;
  localStorage.setItem(email, JSON.stringify(userData));

  alert("Password has been reset. You can now log in.");
  window.location.href = "login.html";
});
