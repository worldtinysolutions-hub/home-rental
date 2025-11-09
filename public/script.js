// ✅ Set your backend URL (Render)
const API_URL = "https://home-rental-dqv3.onrender.com";

// 🏠 Property Data
const homes = [
  {
    id: 1,
    title: "Cozy Apartment in Gothenburg",
    location: "Gothenburg, Sweden",
    price: 12000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Modern Condo in Hisingen",
    location: "Hisingen, Gothenburg, Sweden",
    price: 12000,
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  },
];

// 🖼️ Display all homes
function displayHomes(list) {
  const container = document.getElementById("homes");
  if (!container) return;

  container.innerHTML = "";
  list.forEach((home) => {
    container.innerHTML += `
      <div class="home" onclick="openHomeDetails(${home.id})">
        <img src="${home.image}" alt="${home.title}" />
        <div class="details">
          <h3>${home.title}</h3>
          <p>${home.location}</p>
          <p><strong>${home.price.toLocaleString()} kr / month</strong></p>
        </div>
      </div>
    `;
  });
}

// 🔍 Search function
function searchHomes() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  const filtered = homes.filter(
    (home) =>
      home.title.toLowerCase().includes(query) ||
      home.location.toLowerCase().includes(query)
  );

  displayHomes(filtered.length ? filtered : homes);
}

// 🏡 Open home details
function openHomeDetails(id) {
  const home = homes.find((h) => h.id === id);
  if (!home) return;

  const container = document.getElementById("homeSection");
  container.innerHTML = `
    <div class="user-bar">
      <button onclick="showHomePage()">⬅ Back to Listings</button>
    </div>
    <div class="home-details">
      <img src="${home.image}" alt="${home.title}" style="width:100%;max-width:600px;border-radius:10px;">
      <h2>${home.title}</h2>
      <p>${home.location}</p>
      <p><strong>${home.price.toLocaleString()} kr / month</strong></p>
      <button onclick="startApplication(${home.id})">Apply Now</button>
    </div>
  `;
}

// 🧾 Application process
function startApplication(homeId) {
  const home = homes.find((h) => h.id === homeId);
  if (!home) return;

  const container = document.getElementById("homeSection");
  container.innerHTML = `
    <h2>Apply for ${home.title}</h2>
    <p>Please enter your Swedish personal number (12 digits):</p>
    <input id="personalNumber" placeholder="YYYYMMDDXXXX" maxlength="12" />
    <button onclick="runBackgroundChecks(${home.id})">Check Background</button>
  `;
}

// 🔎 Simulate background checks
function runBackgroundChecks(homeId) {
  const pnr = document.getElementById("personalNumber").value.trim();
  if (pnr.length !== 12) {
    alert("⚠️ Please enter a valid 12-digit personal number.");
    return;
  }

  const container = document.getElementById("homeSection");
  container.innerHTML = `
    <h2>Running background checks...</h2>
    <p>Please wait a moment...</p>
  `;

  setTimeout(() => {
    // Simulate one user failing background check
    if (pnr === "199001011234") {
      container.innerHTML = `
        <h2>Background Check Result</h2>
        <p>❌ Criminal background check failed.</p>
        <p>UC background check: ✅ Successful</p>
        <button onclick="showHomePage()">Back to Listings</button>
      `;
    } else {
      container.innerHTML = `
        <h2>Background Check Result</h2>
        <p>✅ Criminal background check successful.</p>
        <p>✅ UC background check successful.</p>
        <button onclick="goToPayment(${homeId})">Next</button>
      `;
    }
  }, 2500);
}

// 💳 Payment page
function goToPayment(homeId) {
  const home = homes.find((h) => h.id === homeId);
  if (!home) return;

  const total = home.price * 2; // advance + 1 month rent = 24000 kr
  const container = document.getElementById("homeSection");

  container.innerHTML = `
    <h2>Payment for ${home.title}</h2>
    <p>Total due: <strong>${total.toLocaleString()} kr</strong></p>

    <form id="paymentForm" onsubmit="submitPayment(event, ${homeId})">
      <label>Name on Card:</label>
      <input required placeholder="Full Name" />
      <label>Card Number:</label>
      <input required maxlength="16" placeholder="1234 5678 9012 3456" />
      <label>Expiry Date:</label>
      <input required placeholder="MM/YY" maxlength="5" />
      <label>CVV:</label>
      <input required maxlength="3" placeholder="123" />
      <button type="submit">Pay Now</button>
    </form>
  `;
}

// 💰 Submit payment
function submitPayment(event, homeId) {
  event.preventDefault();
  const container = document.getElementById("homeSection");

  container.innerHTML = `
    <h2>Processing Payment...</h2>
    <p>Please wait...</p>
  `;

  setTimeout(() => {
    alert("🎉 The home is now rented out to you. All details will be sent via email.");
    showHomePage();
  }, 2500);
}

// 🔐 Register new user
async function registerUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Registered successfully!");
    } else {
      alert("❌ Registration failed. Please try again.");
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("⚠️ Server error during registration.");
  }
}

// 🔑 Login existing user
async function loginUser(email, password) {
  try {
    console.log("➡️ Sending login request to:", `${API_URL}/login`);

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error response:", text);
      alert("⚠️ Server responded with an error. Check backend logs.");
      return;
    }

    const data = await res.json();
    console.log("✅ Response data:", data);

    if (data.success) {
      alert("✅ Login successful!");
      localStorage.setItem("loggedInUser", email);
      showHomePage();
    } else {
      alert("❌ " + (data.error || "Login failed"));
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("⚠️ Server error during login.");
  }
}

// 🚪 Logout
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("authSection").style.display = "block";
}

// 🏠 Show homepage
function showHomePage() {
  document.getElementById("authSection").style.display = "none";
  const homeSection = document.getElementById("homeSection");
  homeSection.style.display = "block";
  homeSection.innerHTML = `
    <div class="user-bar">
      <span>Welcome, ${localStorage.getItem("loggedInUser") || "User"} 👋</span>
      <button onclick="logoutUser()">Logout</button>
    </div>
    <h2>Available Homes</h2>
    <div id="homes" class="home-grid"></div>
  `;
  displayHomes(homes);
}

// 🧭 Initialize
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    showHomePage();
  } else {
    document.getElementById("authSection").style.display = "block";
  }
});
