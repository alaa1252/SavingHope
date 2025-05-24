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

    // UPDATED FUNCTION: Now checks login before donation
    window.handleDonation = function(donationId, donationTitle, donationPrice) {
        // Show loading state
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Checking...';
        button.disabled = true;

        // Check if user is logged in
        fetch('check_login_status.php', {
            credentials:'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.logged_in) {
                    // User is logged in - process donation directly
                    processDonation(donationId, donationTitle, donationPrice, data.user_info);
                } else {
                    // User not logged in - show login prompt
                    if (confirm(`You need to login to donate. Would you like to login now?`)) {
                        // Save donation info for after login
                        sessionStorage.setItem('pendingDonation', JSON.stringify({
                            id: donationId,
                            title: donationTitle,
                            price: donationPrice
                        }));
                        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                    }
                }
            })
            .catch(error => {
                console.error('Login check failed:', error);
                alert('Unable to verify login status. Please try again.');
            })
            .finally(() => {
                // Restore button state
                button.textContent = originalText;
                button.disabled = false;
            });
    };

    // Process donation for logged-in users
    function processDonation(donationId, donationTitle, donationPrice, userInfo) {
        if (confirm(`Confirm donation of $${donationPrice} to "${donationTitle}"?`)) {
            // Show processing state
          //  const button = event.target;
           // button.textContent = 'Processing...';
          //  button.disabled = true;

            // Send donation to server
            fetch('process_donation.php', {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    donation_id: donationId,
                    donation_type: donationTitle,
                    amount: donationPrice
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Success message
                        alert(`Thank you ${userInfo.full_name}! Your donation of $${donationPrice} has been processed successfully.`);

                        // Optional: Redirect to dashboard or show success page
                      //  if (confirm('Would you like to view your dashboard to see all your donations?')) {
                           // window.location.href = 'dashboard.html';
                       // }
                    } else {
                        alert('Donation failed: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Donation processing failed:', error);
                    alert('Donation processing failed. Please try again.');
                })
                .finally(() => {
                  //  button.textContent = 'Donate Now';
                   // button.disabled = false;
                });
        }
    }

    fetchDonationData();
});