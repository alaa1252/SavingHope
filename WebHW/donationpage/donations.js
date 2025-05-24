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
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Checking...';
        button.disabled = true;

        fetch('check_login_status.php', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.logged_in) {
                    addDonation(donationId, data.user_info.username);
                } else {
                    sessionStorage.setItem('pendingDonation', JSON.stringify({ donationId }));
                    if (confirm('You need to login to donate. Go to login page now?')) {
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

    function addDonation(donationId, username) {
        const donationCard = document.querySelector(`[data-id="${donationId}"]`);
        const donationTitle = donationCard.querySelector('.card-title').textContent;
        const donationPrice = donationCard.querySelector('.card-price').textContent.replace(/[^0-9.]/g, '');

        if (confirm(`Confirm donation of $${donationPrice} to "${donationTitle}"?`)) {
            fetch('process_donation.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    donation_id: donationId,
                    username: username,
                    donation_type: donationTitle,
                    amount: donationPrice
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert(`Thank you for your donation of $${donationPrice}!`);
                        sessionStorage.removeItem('pendingDonation');
                    } else {
                        alert('Failed to process donation: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(err => {
                    alert('Error processing donation. Please try again later.');
                    console.error(err);
                });
        }
    }

    fetchDonationData();
});