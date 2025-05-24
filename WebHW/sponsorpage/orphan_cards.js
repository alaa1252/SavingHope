document.addEventListener('DOMContentLoaded', function() {
    function fetchOrphanData() {
        fetch('http://localhost/webcourse/WebHW/sponsorpage/get_orphans.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    renderOrphanCards(data.data);
                } else {
                    console.error('Error fetching orphan data:', data.error);
                    displayErrorMessage('Failed to load children data. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error fetching orphan data:', error);
                displayErrorMessage('Failed to load children data. Please try again later.');
            });
    }

    function displayErrorMessage(message) {
        const container = document.querySelector('.orphan-cards-container');
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    function renderOrphanCards(orphans) {
        const container = document.querySelector('.orphan-cards-container');
        container.innerHTML = '';

        if (orphans.length === 0) {
            container.innerHTML = '<p class="no-data-message">No children available for sponsorship at this time.</p>';
            return;
        }

        orphans.forEach(orphan => {
            const card = createOrphanCard(orphan);
            container.appendChild(card);
        });
    }

    function createOrphanCard(orphan) {
        const card = document.createElement('div');
        card.className = 'orphan-profile-card';

        const photoUrl = orphan.photo_url ? 'http://localhost/webcourse/WebHW/' + orphan.photo_url : 'http://localhost/webcourse/WebHW/images/placeholder.jpg';

        card.innerHTML = `
            <div class="profile-photo-section">
                <img src="${photoUrl}" alt="${orphan.name}'s photo" class="child-photo">
                <h2 class="child-name">${orphan.name}</h2>
                <p class="child-age">${orphan.age} years old</p>
            </div>
            
            <div class="profile-details-section">
                <div class="child-story">
                    <h3>${orphan.name}'s Story</h3>
                    <p>${orphan.story}</p>
                </div>
                
                <div class="child-info">
                    <div class="info-item">
                        <div class="info-label">Education</div>
                        <div class="info-value">${orphan.education}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Location</div>
                        <div class="info-value">${orphan.location}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Medical Needs</div>
                        <div class="info-value">${orphan.medical_needs}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Interests</div>
                        <div class="info-value">${orphan.interests}</div>
                    </div>
                </div>
                
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Sponsorship Progress</span>
                        <span>${orphan.sponsorship_percentage}% Sponsored</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${orphan.sponsorship_percentage}%"></div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="sponsorChild(${orphan.id})">Sponsor ${orphan.name}</button>
            </div>
        `;

        return card;
    }

    window.sponsorChild = function(orphanId) {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Checking...';
        button.disabled = true;

        fetch('check_login_status.php', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.logged_in) {
                    addSponsorship(orphanId, data.user_info.username);
                } else {
                    sessionStorage.setItem('pendingSponsorship', JSON.stringify({ orphanId }));
                    if (confirm('You need to login to sponsor a child. Go to login page now?')) {
                        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                    }
                }
            })
            .catch(err => {
                alert('Failed to check login status. Please try again.');
                console.error(err);
            })
            .finally(() => {
                button.textContent = originalText;
                button.disabled = false;
            });
    };

    function addSponsorship(orphanId, username) {
        const monthlyAmount = prompt('Enter monthly sponsorship amount (USD):', '50');
        if (!monthlyAmount || isNaN(monthlyAmount) || monthlyAmount <= 0) {
            alert('Please enter a valid positive number for monthly amount.');
            return;
        }

        fetch('add_sponsorship.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orphan_id: orphanId, username: username, monthly_amount: monthlyAmount })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Thank you for sponsoring this child!');
                    sessionStorage.removeItem('pendingSponsorship');

                } else {
                    alert('Failed to add sponsorship: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => {
                alert('Error processing sponsorship. Please try again later.');
                console.error(err);
            });
    }


    fetchOrphanData();
});