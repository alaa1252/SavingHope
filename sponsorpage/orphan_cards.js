document.addEventListener('DOMContentLoaded', function() {
    function fetchOrphanData() {
        fetch('http://localhost/savinghope/sponsorpage/get_orphans.php')
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
        
        const photoUrl = orphan.photo_url ? 'http://localhost/savinghope/' + orphan.photo_url : 'http://localhost/savinghope//images/placeholder.jpg';
        
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
        window.location.href = `sponsor-form.php?id=${orphanId}`;
    };

    fetchOrphanData();
});