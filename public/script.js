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
  if (!hom
