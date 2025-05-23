document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".volunteer-cards");

    fetch('http://localhost/webcourse/WebHW/volunteerpage/fetch_volunteers.php')
        .then((res) => res.json())
        .then((data) => {
            data.forEach((volunteer) => {
                const card = document.createElement("div");
                card.className = "vol-card";

                card.innerHTML = `
          <i class="${volunteer.IconClass} vol-icon"></i>
          <h3>${volunteer.Title}</h3>
          <p>${volunteer.Description}</p>
          <a href="signup.html?volunteer_id=${volunteer.id}" class="volunteer-btn">Join</a>
        `;

                container.appendChild(card);
            });
        })
        .catch((err) => {
            console.error("Error loading volunteer options:", err);
            container.innerHTML = "<p class='error'>Failed to load volunteer cards.</p>";
        });
});