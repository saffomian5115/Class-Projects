// Load user's listings on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'seller' && user.role !== 'admin') {
        document.getElementById('listingsContainer').innerHTML = `
            <div class="glass" style="text-align: center; padding: 50px;">
                <i class="fas fa-lock" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Seller Access Only</h3>
                <p>You need to be a seller to view listings.</p>
                <a href="profile.html" class="neon-btn primary" style="margin-top: 20px;">Upgrade to Seller</a>
            </div>
        `;
        return;
    }
    
    loadMyListings();
});

// Load my listings
async function loadMyListings() {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/seller/my-listings`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayListings(data.vehicles);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        document.getElementById('listingsContainer').innerHTML = `
            <div class="glass" style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--neon-red); margin-bottom: 20px;"></i>
                <h3>Failed to Load Listings</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Display listings
function displayListings(vehicles) {
    const container = document.getElementById('listingsContainer');
    
    if (!vehicles || vehicles.length === 0) {
        container.innerHTML = `
            <div class="glass" style="text-align: center; padding: 50px;">
                <i class="fas fa-car" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>No Listings Yet</h3>
                <p>You haven't listed any vehicles yet.</p>
                <a href="add-listing.html" class="neon-btn primary" style="margin-top: 20px;">List Your First Vehicle</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="listings-table-container">
            <table class="listings-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.map(vehicle => `
                        <tr>
                            <td>
                                <img src="${vehicle.images && vehicle.images[0] ? vehicle.images[0] : 'https://via.placeholder.com/50'}" 
                                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                            </td>
                            <td>${vehicle.title}</td>
                            <td><i class="fas fa-rupee-sign"></i> ${formatPrice(vehicle.price)}</td>
                            <td>${vehicle.city}</td>
                            <td>
                                <span class="listing-status status-${vehicle.status}">
                                    ${vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                </span>
                            </td>
                            <td>${vehicle.views}</td>
                            <td>
                                <div class="action-buttons">
                                    <button onclick="viewListing('${vehicle._id}')" class="neon-btn small" style="padding: 5px 10px;">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="openEditModal('${vehicle._id}', '${vehicle.title}', ${vehicle.price}, '${vehicle.city}', \`${vehicle.description.replace(/'/g, "\\'")}\`)" 
                                            class="neon-btn small" style="padding: 5px 10px;">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteListing('${vehicle._id}')" class="neon-btn danger small" style="padding: 5px 10px;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// View listing
function viewListing(id) {
    window.location.href = `vehicle-detail.html?id=${id}`;
}

// Open edit modal
function openEditModal(id, title, price, city, description) {
    document.getElementById('editVehicleId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editPrice').value = price;
    document.getElementById('editCity').value = city;
    document.getElementById('editDescription').value = description;
    document.getElementById('editModal').classList.add('active');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Handle edit form submission
const editForm = document.getElementById('editForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('editVehicleId').value;
        const title = document.getElementById('editTitle').value;
        const price = document.getElementById('editPrice').value;
        const city = document.getElementById('editCity').value;
        const description = document.getElementById('editDescription').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ title, price, city, description })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('Listing updated successfully', 'success');
                closeEditModal();
                loadMyListings();
            } else {
                showAlert(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            console.error('Error updating listing:', error);
            showAlert('Failed to update listing', 'error');
        }
    });
}

// Delete listing
async function deleteListing(id) {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Listing deleted successfully', 'success');
            loadMyListings();
        } else {
            showAlert(data.message || 'Delete failed', 'error');
        }
    } catch (error) {
        console.error('Error deleting listing:', error);
        showAlert('Failed to delete listing', 'error');
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-PK').format(price);
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