const loginBtn = document.getElementById("loginBtn");
const privateZone = document.getElementById("privateZone");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

// Apri modal login
loginBtn.addEventListener("click", () => {
  if (localStorage.getItem("loggedIn") === "true") {
    // Logout
    localStorage.removeItem("loggedIn");
    privateZone.classList.add("hidden");
    loginBtn.textContent = "Login";
  } else {
    // Mostra modal
    loginModal.classList.remove("hidden");
  }
});

// Chiudi modal
closeModal.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  loginError.classList.add("hidden");
});

// Submit login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/.netlify/functions/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("loggedIn", "true");
    privateZone.classList.remove("hidden");
    loginBtn.textContent = "Logout";
    loginModal.classList.add("hidden");
  } else {
    loginError.classList.remove("hidden");
  }
});

// Controllo stato al caricamento
if (localStorage.getItem("loggedIn") === "true") {
  privateZone.classList.remove("hidden");
  loginBtn.textContent = "Logout";
}
