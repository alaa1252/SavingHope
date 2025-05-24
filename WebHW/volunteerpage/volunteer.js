document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".volunteer-cards");

    fetch('http://localhost/webcourse/WebHW/volunteerpage/fetch_volunteers.php')
        .then(res => res.json())
        .then(data => {
            data.forEach(volunteer => {
                const card = document.createElement("div");
                card.className = "vol-card";


                card.innerHTML = `
                    <i class="${volunteer.IconClass} vol-icon"></i>
                    <h3>${volunteer.Title}</h3>
                    <p>${volunteer.Description}</p>
                    <button class="volunteer-btn" data-volunteer-id="${volunteer.id}">Join</button>
                `;

                container.appendChild(card);
            });


            container.addEventListener('click', event => {
                if (event.target.classList.contains('volunteer-btn')) {
                    const volunteerId = event.target.getAttribute('data-volunteer-id');
                    handleJoinVolunteer(volunteerId);
                }
            });
        })
        .catch(err => {
            console.error("Error loading volunteer options:", err);
            container.innerHTML = "<p class='error'>Failed to load volunteer cards.</p>";
        });
});

function handleJoinVolunteer(volunteerId) {

    fetch('check_login_status.php', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {

                return fetch('join_volunteer.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ volunteer_id: volunteerId })
                });
            } else {

                if (confirm("You need to log in to join. Go to login page?")) {

                    sessionStorage.setItem('pendingVolunteerId', volunteerId);
                    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                }
                throw new Error('User not logged in');
            }
        })
        .then(response => {
            if (!response) return;
            return response.json();
        })
        .then(result => {
            if (result) {
                if (result.success) {
                    alert("You have successfully joined this volunteer group!");
                } else {
                    alert("Error joining volunteer: " + (result.error || "Unknown error"));
                }
            }
        })
        .catch(err => {
            if (err.message !== 'User not logged in') {
                console.error("Error processing join:", err);
                alert("Failed to join volunteer group. Please try again.");
            }
        });
}