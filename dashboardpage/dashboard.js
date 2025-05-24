document.addEventListener('DOMContentLoaded', function() {
    function fetchDashboardData() {
        fetch('http://localhost/webcourse/WebHW/dashboardpage/get_dashboard_data.php', { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    updateDashboard(data.data);
                } else {
                    console.error('Error fetching dashboard data:', data.error);
                    displayErrorMessage('Failed to load dashboard data. Please try again later.');
                    if (data.error === 'User not authenticated') {
                    window.location.href = 'login.html';
                }
            }
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
                displayErrorMessage('Failed to load dashboard data. Please try again later.');
            });
    }

    function displayErrorMessage(message) {
        const dashboard = document.querySelector('.dashboard');
        dashboard.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    function updateDashboard(data) {
        updateDonationStats(data);
        
        updateSponsoredChild(data);
        
        updateDonationHistory(data.donation_history);
        
        updateProfileInfo(data.profile);
        
        updateChildUpdates(data.child_updates);
    }

    function updateDonationStats(data) {
        const totalDonatedElement = document.querySelector('.stat-card .stat-value');
        if (totalDonatedElement) {
            totalDonatedElement.textContent = '$' + data.total_donated;
        }

        const monthlyElements = document.querySelectorAll('.stat-card.monthly .stat-value');
        if (monthlyElements.length > 0 && data.sponsorship) {
            monthlyElements[0].textContent = '$' + parseFloat(data.sponsorship.monthly_amount).toFixed(2);
        }

        const nextPaymentElement = document.querySelector('.stat-card.monthly .stat-desc');
        if (nextPaymentElement && data.sponsorship) {
            const paymentDate = new Date(data.sponsorship.next_payment_date);
            const formattedDate = paymentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            nextPaymentElement.textContent = 'Next payment: ' + formattedDate;
        }

        const impactValueElement = document.querySelector('.stat-card.impact .stat-value');
        if (impactValueElement) {
            impactValueElement.textContent = data.months_of_support + ' Months';
        }
    }

    function updateSponsoredChild(data) {
        if (!data.sponsorship) return;

        const sponsorship = data.sponsorship;

        const childPhoto = document.querySelector('.sponsored-child .child-photo');
        if (childPhoto) {
            const photoUrl = sponsorship.photo_url ? 
                'http://localhost/webcourse/WebHW/' + sponsorship.photo_url :
                'http://localhost/webcourse/WebHW//images/placeholder.jpg';
            childPhoto.src = photoUrl;
            childPhoto.alt = sponsorship.child_name + "'s photo";
        }

        const childName = document.querySelector('.sponsored-child .child-name');
        if (childName) {
            childName.textContent = sponsorship.child_name;
        }

        const childAge = document.querySelector('.sponsored-child .child-age');
        if (childAge) {
            childAge.textContent = sponsorship.age + ' years old';
        }

        const childStory = document.querySelector('.sponsored-child p');
        if (childStory) {
            childStory.textContent = sponsorship.story;
        }

        const progressLabel = document.querySelector('.progress-label span:last-child');
        if (progressLabel) {
            progressLabel.textContent = sponsorship.education_fund_progress + '%';
        }

        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = sponsorship.education_fund_progress + '%';
        }
    }

    function updateDonationHistory(donationHistory) {
        const tableBody = document.querySelector('.donation-table tbody');
        if (!tableBody || !donationHistory) return;

        tableBody.innerHTML = '';

        donationHistory.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.formatted_date}</td>
                <td>${donation.donation_type}</td>
                <td>${donation.formatted_amount}</td>
                <td><span class="badge badge-success">${donation.status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateProfileInfo(profile) {
        if (!profile) return;

        const profileSection = document.querySelector('.sidebar-section div');
        if (profileSection) {
            profileSection.innerHTML = `
                <strong>Name:</strong> ${profile.name}<br>
                <strong>Email:</strong> ${profile.email}<br>
                <strong>Phone:</strong> ${profile.phone}<br>
                <strong>Member since:</strong> ${profile.member_since}
            `;
        }
    }

    function updateChildUpdates(updates) {
        const updatesContainer = document.querySelector('.child-updates');
        if (!updatesContainer || !updates) return;

        const existingUpdates = updatesContainer.querySelectorAll('.update-item');
        existingUpdates.forEach(item => item.remove());

        updates.forEach(update => {
            const updateElement = document.createElement('div');
            updateElement.className = 'update-item';
            updateElement.innerHTML = `
                <div class="update-date">${update.formatted_date}</div>
                <div class="update-content">${update.update_content}</div>
            `;
            updatesContainer.appendChild(updateElement);
        });
    }

    fetchDashboardData();
});