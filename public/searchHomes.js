// === Search Homes ===
export const searchHomes = () => {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    const filtered = homes.filter(
        (home) =>
            home.title.toLowerCase().includes(query) ||
            home.location.toLowerCase().includes(query)
    );
    displayHomes(filtered.length ? filtered : homes);
};