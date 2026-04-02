let currentFilters = {
    page: 1,
    limit: 9,
    city: 'all',
    brand: 'all',
    vehicleType: 'all',
    condition: 'all',
    minPrice: '',
    maxPrice: '',
    search: ''
};

let totalPages = 1;

// Load vehicles with filters
async function loadVehicles(filters = {}) {
    try {
        const params = new URLSearchParams();
        
        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key] && currentFilters[key] !== 'all' && currentFilters[key] !== '') {
                params.append(key, currentFilters[key]);
            }
        });
        
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'all' && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });
        
        const response = await fetch(`${API_BASE_URL}/vehicles?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
            displayVehicles(data.vehicles);
            updatePagination(data.pagination);
            updateVehicleCount(data.pagination.total);
        } else {
            showError('Failed to load vehicles');
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
        showError('Failed to load vehicles');
    }
}

// Display vehicles in grid
function displayVehicles(vehicles) {
    const grid = document.getElementById('vehiclesGrid');
    if (!grid) return;
    
    if (!vehicles || vehicles.length === 0) {
        grid.innerHTML = `
            <div class="glass" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-car" style="font-size: 3rem; opacity: 0.5; margin-bottom: 20px; display: block;"></i>
                <h3>No vehicles found</h3>
                <p style="opacity: 0.7;">Try adjusting your filters or check back later</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card" onclick="window.location.href='vehicle-detail.html?id=${vehicle._id}'">
            <div class="vehicle-image-container">
                <img src="${vehicle.images && vehicle.images[0] ? vehicle.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}" 
                     alt="${vehicle.title}" 
                     class="vehicle-image"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <span class="vehicle-badge">${vehicle.status === 'approved' ? '✓ Verified' : 'Pending'}</span>
            </div>
            <div class="vehicle-info">
                <h3 class="vehicle-title">${vehicle.title}</h3>
                <div class="vehicle-details">
                    <span><i class="fas fa-calendar"></i> ${vehicle.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${vehicle.condition}</span>
                </div>
                <div class="vehicle-price">
                    <i class="fas fa-rupee-sign"></i> ${formatPrice(vehicle.price)}
                </div>
                <div class="vehicle-location">
                    <i class="fas fa-map-marker-alt"></i> ${vehicle.city}
                </div>
                <div style="margin-top: 15px;">
                    <span style="background: rgba(0,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">
                        ${vehicle.vehicleType}
                    </span>
                    <span style="background: rgba(0,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin-left: 8px;">
                        ${vehicle.brand}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Format price with commas
function formatPrice(price) {
    return new Intl.NumberFormat('en-PK').format(price);
}

// Update pagination controls
function updatePagination(pagination) {
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    
    totalPages = pagination.pages;
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let buttons = '';
    
    // Previous button
    if (pagination.page > 1) {
        buttons += `<button class="neon-btn small" onclick="changePage(${pagination.page - 1})"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === pagination.page) {
            buttons += `<button class="neon-btn primary small" style="opacity: 1;">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= pagination.page - 2 && i <= pagination.page + 2)) {
            buttons += `<button class="neon-btn secondary small" onclick="changePage(${i})">${i}</button>`;
        } else if (i === pagination.page - 3 || i === pagination.page + 3) {
            buttons += `<span style="padding: 0 10px;">...</span>`;
        }
    }
    
    // Next button
    if (pagination.page < totalPages) {
        buttons += `<button class="neon-btn small" onclick="changePage(${pagination.page + 1})"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    paginationDiv.innerHTML = buttons;
}

// Change page
function changePage(page) {
    currentFilters.page = page;
    loadVehicles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update vehicle count
function updateVehicleCount(count) {
    const countElement = document.getElementById('vehicleCount');
    if (countElement) {
        countElement.textContent = `${count} vehicle${count !== 1 ? 's' : ''} found`;
    }
}

// Show error message
function showError(message) {
    const grid = document.getElementById('vehiclesGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="glass" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--neon-red); margin-bottom: 20px; display: block;"></i>
                <h3>Error</h3>
                <p style="opacity: 0.7;">${message}</p>
            </div>
        `;
    }
}

// Initialize filters on vehicles page
if (document.getElementById('applyFilters')) {
    // Get filter elements
    const cityFilter = document.getElementById('cityFilter');
    const typeFilter = document.getElementById('typeFilter');
    const brandFilter = document.getElementById('brandFilter');
    const conditionFilter = document.getElementById('conditionFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const searchInput = document.getElementById('searchInput');
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    // Apply filters
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            currentFilters.city = cityFilter?.value || 'all';
            currentFilters.vehicleType = typeFilter?.value || 'all';
            currentFilters.brand = brandFilter?.value || 'all';
            currentFilters.condition = conditionFilter?.value || 'all';
            currentFilters.minPrice = minPrice?.value || '';
            currentFilters.maxPrice = maxPrice?.value || '';
            currentFilters.search = searchInput?.value || '';
            currentFilters.page = 1;
            loadVehicles();
        });
    }
    
    // Reset filters
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (cityFilter) cityFilter.value = 'all';
            if (typeFilter) typeFilter.value = 'all';
            if (brandFilter) brandFilter.value = 'all';
            if (conditionFilter) conditionFilter.value = 'all';
            if (minPrice) minPrice.value = '';
            if (maxPrice) maxPrice.value = '';
            if (searchInput) searchInput.value = '';
            
            currentFilters = {
                page: 1,
                limit: 9,
                city: 'all',
                brand: 'all',
                vehicleType: 'all',
                condition: 'all',
                minPrice: '',
                maxPrice: '',
                search: ''
            };
            loadVehicles();
        });
    }
    
    // Search on Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentFilters.search = searchInput.value;
                currentFilters.page = 1;
                loadVehicles();
            }
        });
    }
    
    // Load initial vehicles
    loadVehicles();
}