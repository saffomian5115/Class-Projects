let currentUser = null;

// Load profile on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadProfile();
});

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            displayProfile(currentUser);
            loadUserStats();
            loadUserMessages();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profileContent').innerHTML = `
            <div class="glass" style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--neon-red); margin-bottom: 20px;"></i>
                <h3>Failed to Load Profile</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="neon-btn primary" style="margin-top: 20px;">Try Again</button>
            </div>
        `;
    }
}

// Display profile
function displayProfile(user) {
    const container = document.getElementById('profileContent');
    
    container.innerHTML = `
        <div class="profile-header glass">
            <div class="profile-avatar-large">
                ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h1>${user.name}</h1>
                <p><i class="fas fa-envelope"></i> ${user.email}</p>
                <p><i class="fas fa-phone"></i> ${user.phone}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${user.city}</p>
                <p><i class="fas fa-tag"></i> Role: <span class="neon-text">${user.role.toUpperCase()}</span></p>
            </div>
        </div>
        
        <div class="profile-stats" id="profileStats">
            <div class="stat-card glass">
                <div class="stat-number" id="listingsCount">0</div>
                <div>Total Listings</div>
            </div>
            <div class="stat-card glass">
                <div class="stat-number" id="messagesCount">0</div>
                <div>Messages</div>
            </div>
            <div class="stat-card glass">
                <div class="stat-number" id="viewsCount">0</div>
                <div>Total Views</div>
            </div>
        </div>
        
        <div class="profile-tabs">
            <button class="profile-tab active" onclick="switchTab('edit')">Edit Profile</button>
            <button class="profile-tab" onclick="switchTab('password')">Change Password</button>
            <button class="profile-tab" onclick="switchTab('messages')">Messages</button>
            ${user.role === 'seller' ? `<button class="profile-tab" onclick="switchTab('analytics')">Analytics</button>` : ''}
        </div>
        
        <div id="editTab" class="tab-content active">
            <div class="glass" style="padding: 30px;">
                <h3>Edit Profile</h3>
                <form id="editProfileForm">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="editName" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="editPhone" value="${user.phone}" required>
                    </div>
                    <div class="form-group">
                        <label>City</label>
                        <select id="editCity">
                            <option value="Karachi" ${user.city === 'Karachi' ? 'selected' : ''}>Karachi</option>
                            <option value="Lahore" ${user.city === 'Lahore' ? 'selected' : ''}>Lahore</option>
                            <option value="Islamabad" ${user.city === 'Islamabad' ? 'selected' : ''}>Islamabad</option>
                            <option value="Rawalpindi" ${user.city === 'Rawalpindi' ? 'selected' : ''}>Rawalpindi</option>
                            <option value="Multan" ${user.city === 'Multan' ? 'selected' : ''}>Multan</option>
                            <option value="Faisalabad" ${user.city === 'Faisalabad' ? 'selected' : ''}>Faisalabad</option>
                            <option value="Other" ${user.city === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <button type="submit" class="neon-btn primary">Update Profile</button>
                </form>
            </div>
        </div>
        
        <div id="passwordTab" class="tab-content">
            <div class="glass" style="padding: 30px;">
                <h3>Change Password</h3>
                <form id="changePasswordForm">
                    <div class="form-group">
                        <label>Current Password</label>
                        <input type="password" id="currentPassword" required>
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="newPassword" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    <button type="submit" class="neon-btn primary">Change Password</button>
                </form>
            </div>
        </div>
        
        <div id="messagesTab" class="tab-content">
            <div class="glass" style="padding: 30px;">
                <h3>Messages</h3>
                <div id="messagesList" class="messages-list">
                    <p>Loading messages...</p>
                </div>
            </div>
        </div>
        
        ${user.role === 'seller' ? `
            <div id="analyticsTab" class="tab-content">
                <div class="glass" style="padding: 30px;">
                    <h3>Listing Analytics</h3>
                    <div id="analyticsContent">
                        <p>Loading analytics...</p>
                    </div>
                </div>
            </div>
        ` : ''}
    `;
    
    // Setup form handlers
    document.getElementById('editProfileForm').addEventListener('submit', updateProfile);
    document.getElementById('changePasswordForm').addEventListener('submit', changePassword);
}

// Load user stats
async function loadUserStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/seller/my-listings`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const listings = data.vehicles;
            const totalViews = listings.reduce((sum, v) => sum + (v.views || 0), 0);
            
            document.getElementById('listingsCount').textContent = listings.length;
            document.getElementById('viewsCount').textContent = totalViews;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load user messages
async function loadUserMessages() {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/inbox`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('messagesCount').textContent = data.messages.length;
            displayMessages(data.messages);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Display messages
function displayMessages(messages) {
    const container = document.getElementById('messagesList');
    
    if (!messages || messages.length === 0) {
        container.innerHTML = '<p>No messages yet.</p>';
        return;
    }
    
    container.innerHTML = messages.map(msg => `
        <div class="message-card ${!msg.isRead ? 'unread' : ''}">
            <div class="message-header">
                <span class="message-sender">
                    <i class="fas fa-user"></i> ${msg.buyerId.name}
                </span>
                <span class="message-date">
                    ${new Date(msg.createdAt).toLocaleDateString()}
                </span>
            </div>
            <div class="message-vehicle">
                <i class="fas fa-car"></i> ${msg.vehicleId.title}
            </div>
            <div class="message-content">
                ${msg.message}
            </div>
            <div class="message-actions">
                <button onclick="markAsRead('${msg._id}')" class="neon-btn small">Mark as Read</button>
                <button onclick="deleteMessage('${msg._id}')" class="neon-btn danger small">Delete</button>
            </div>
        </div>
    `).join('');
}

// Mark message as read
async function markAsRead(messageId) {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        
        if (response.ok) {
            loadUserMessages();
        }
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
}

// Delete message
async function deleteMessage(messageId) {
    if (!confirm('Delete this message?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        
        if (response.ok) {
            loadUserMessages();
        }
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}

// Update profile
async function updateProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const city = document.getElementById('editCity').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ name, phone, city })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update local storage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            storedUser.name = name;
            storedUser.phone = phone;
            storedUser.city = city;
            localStorage.setItem('user', JSON.stringify(storedUser));
            
            showAlert('Profile updated successfully', 'success');
            loadProfile();
        } else {
            showAlert(data.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Failed to update profile', 'error');
    }
}

// Change password
async function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Password changed successfully', 'success');
            document.getElementById('changePasswordForm').reset();
        } else {
            showAlert(data.message || 'Password change failed', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('Failed to change password', 'error');
    }
}

// Switch tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '100px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '1000';
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}