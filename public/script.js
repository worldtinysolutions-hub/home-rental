// ==========================================
// DreamStay Frontend Logic (script.js)
// ==========================================

// 🔑 Register new user
async function registerUser(email, password) {
  try {
    const API_URL = "https://your-backend-service-name.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Registered successfully! You can now log in.");
    } else {
      alert("❌ " + (data.error || "Registration failed."));
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("⚠️ Server error during registration.");
  }
}

// 🔐 Login existing user
async function loginUser(email, password) {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("loggedInUser", email);
      alert("✅ Login successful!");
      showHomePage();
      await loadHomes();
    } else {
      alert("❌ " + (data.error || "Login failed"));
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("⚠️ Server error during login.");
  }
}

// 🚪 Logout user
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  alert("👋 You have logged out.");
  showLoginPage();
}

// 🏠 Fetch homes from backend
async function loadHomes() {
  try {
    const res = await fetch(`${API_URL}/login`, { ... });
    const data = await res.json();
    displayHomes(data);
  } catch (err) {
    console.error("Error loading homes:", err);
    alert("⚠️ Could not load homes from server.");
  }
}

// 🖼️ Display homes dynamically
// 🏠 Property Data
// 🏠 Property Data
const homes = [
  {
    id: 1,
    title: "Cozy Apartment in Gothenburg",
    location: "Gothenburg, Sweden",
    price: "12000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Modern Condo in Hisingen",
    location: "Hisingen, Gothenburg, Sweden",
    price: "10800",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  },
];

// === Display Homes ===
function displayHomes(list) {
  const container = document.getElementById("homes");
  if (!container) return;

  container.innerHTML = "";
  list.forEach((home) => {
    const div = document.createElement("div");
    div.classList.add("home");
    div.innerHTML = `
      <img src="${home.image}" alt="${home.title}" />
      <div class="details">
        <h3>${home.title}</h3>
        <p>${home.location}</p>
        <p><strong>${home.price} kr / month</strong></p>
      </div>
    `;
    div.onclick = () => openModal(home);
    container.appendChild(div);
  });
}

// === Open Property Modal ===
function openModal(home) {
  document.getElementById("propertyModal").style.display = "block";
  document.getElementById("modalImage").src = home.image;
  document.getElementById("modalTitle").innerText = home.title;
  document.getElementById("modalLocation").innerText = home.location;
  document.getElementById("modalPrice").innerText = `${home.price} kr / month`;

  // store selected property for later (like during apply)
  localStorage.setItem("selectedHome", JSON.stringify(home));
}

function closeModal() {
  document.getElementById("propertyModal").style.display = "none";
}

// === Application Process ===
function openApplication() {
  document.getElementById("propertyModal").style.display = "none";
  document.getElementById("applyModal").style.display = "block";
}

function closeApplyModal() {
  document.getElementById("applyModal").style.display = "none";
}

// === Run Simulated Background Checks ===
async function runBackgroundChecks() {
  const pnr = document.getElementById("pnrInput").value.trim();
  const resultDiv = document.getElementById("checkResult");

  if (!/^[0-9]{12}$/.test(pnr)) {
    resultDiv.innerHTML = "❌ Please enter a valid 12-digit personal number.";
    resultDiv.style.color = "red";
    return;
  }

  resultDiv.style.color = "#333";
  resultDiv.innerHTML = `
    <div class="spinner"></div>
    <p>⏳ Running background checks...</p>
    <div class="progress-bar"><div class="progress-fill"></div></div>
  `;

  const fill = document.querySelector(".progress-fill");
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    fill.style.width = progress + "%";
    if (progress >= 100) {
      clearInterval(interval);
      showCheckResult(pnr);
    }
  }, 300);
}

function showCheckResult(pnr) {
  const resultDiv = document.getElementById("checkResult");

  const failedPnr = "199001011234";

  if (pnr === failedPnr) {
    resultDiv.style.color = "red";
    resultDiv.innerHTML = `
      ❌ Criminal background check failed.<br>
      ✅ UC background check successful.<br><br>
      ⚠️ Your application cannot be processed further.
    `;
  } else {
    resultDiv.style.color = "green";
    resultDiv.innerHTML = `
      ✅ Criminal background check successful.<br>
      ✅ UC background check successful.<br><br>
      🏡 Your application has been received!<br><br>
      <button class="next-btn" onclick="goToPayment()">Next ➡️</button>
    `;
  }
}

// === Go to Payment Page ===
function goToPayment() {
  window.location.href = "payment.html";
}

// === Init ===
document.addEventListener("DOMContentLoaded", () => {
  displayHomes(homes);
});


// 🧭 Open home details (simple popup)
// 🔍 Search homes
const searchHomes = () => {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const cards = document.querySelectorAll(".home");

  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const location = card.querySelector("p").textContent.toLowerCase();
    card.style.display =
      title.includes(query) || location.includes(query) ? "block" : "none";
  });
};

// 🧭 Show/hide views
function showHomePage() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("homeSection").style.display = "block";
  const user = localStorage.getItem("loggedInUser");
  document.getElementById("welcomeMsg").textContent = `Welcome, ${user}!`;
}

function showLoginPage() {
  document.getElementById("authSection").style.display = "block";
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("welcomeMsg").textContent = "";
}

// 📍 Smooth navigation scroll
function setupNavigation() {
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// 🧭 Initialize
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();

  // Add contact info
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.innerHTML = `
      <h2>Contact Us</h2>
      <p>Have questions or need help finding a rental? We’re here to help.</p>
      <p><strong>Contact Person:</strong> <br> World Tiny Solutions<br>
      <a href="mailto:worldtinysolutions@gmail.com">worldtinysolutions@gmail.com</a></p>
    `;
  }

  const user = localStorage.getItem("loggedInUser");
  if (user) {
    showHomePage();
    await loadHomes();
  } else {
    showLoginPage();
  }
});
