document.addEventListener('DOMContentLoaded', function() {
    function fetchDonationData() {
        fetch('http://localhost/webcourse/WebHW/donationpage/get_donations.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    renderDonationCards(data.data);
                } else {
                    console.error('Error fetching donation data:', data.error);
                    displayErrorMessage('Failed to load donation data. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error fetching donation data:', error);
                displayErrorMessage('Failed to load donation data. Please try again later.');
            });
    }

    function displayErrorMessage(message) {
        const container = document.getElementById('donations-container');
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    function renderDonationCards(donations) {
        const container = document.getElementById('donations-container');
        
        container.innerHTML = '';
        
        if (donations.length === 0) {
            container.innerHTML = '<p class="no-data-message">No donations available at this time.</p>';
            return;
        }
        
        donations.forEach(donation => {
            const card = createDonationCard(donation);
            container.appendChild(card);
        });
    }

    function createDonationCard(donation) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'container';
        
        const imageUrl = donation.pic_url ? 'http://localhost/webcourse/WebHW/' + donation.pic_url : 'http://localhost/webcourse/WebHW//images/placeholder.jpg';
        
        cardDiv.innerHTML = `
            <div class="donation-card" data-id="${donation.id}">
                <div class="text-content">
                    <div>
                        <h3 class="card-title">${donation.title}</h3>
                        <p class="card-description">${donation.description}</p>
                        <p class="card-price">${donation.formatted_price}</p>
                    </div>
                    
                    <button class="btn btn-primary" onclick="handleDonation(${donation.id})">
                        Donate Now
                    </button>
                </div>
                
                <div class="image-container">
                    <img src="${imageUrl}" 
                         alt="${donation.title}" 
                         class="card-image"
                         onerror="this.src='http://localhost/savinghope/images/placeholder.jpg'">
                </div>
            </div>
        `;
        
        return cardDiv;
    }

    window.handleDonation = function(donationId) {
        window.location.href = `donation_form.php?id=${donationId}`;
    };

    fetchDonationData();
});