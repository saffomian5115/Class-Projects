let selectedImages = [];
let selectedModel = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    
    // Check if user is logged in and is seller/admin
    const user = getCurrentUser();
    if (!user) {
        showAlert('Please login to list a vehicle', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    if (user.role !== 'seller' && user.role !== 'admin') {
        showAlert('Only sellers can list vehicles. Upgrade your account?', 'error');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }
});

// Preview images before upload
function previewImages(input) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    selectedImages = [];
    
    if (input.files) {
        const files = Array.from(input.files).slice(0, 5);
        
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                selectedImages.push(file);
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const div = document.createElement('div');
                    div.className = 'image-preview';
                    div.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image" onclick="removeImage(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    preview.appendChild(div);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Update file input with remaining files
        const dataTransfer = new DataTransfer();
        selectedImages.forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
    }
}

// Remove image from preview
function removeImage(index) {
    selectedImages.splice(index, 1);
    const input = document.getElementById('images');
    const dataTransfer = new DataTransfer();
    selectedImages.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
    
    // Refresh preview
    previewImages(input);
}

// Handle form submission
const form = document.getElementById('addListingForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const title = document.getElementById('title').value;
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const price = document.getElementById('price').value;
        const city = document.getElementById('city').value;
        const condition = document.getElementById('condition').value;
        const vehicleType = document.getElementById('vehicleType').value;
        const description = document.getElementById('description').value;
        
        // Validate
        if (!title || !brand || !model || !year || !price || !city || !condition || !vehicleType || !description) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        if (selectedImages.length === 0) {
            showAlert('Please upload at least one image', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Listing...';
        submitBtn.disabled = true;
        
        try {
            // Step 1: Create vehicle
            const vehicleResponse = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    title,
                    brand,
                    model,
                    year: parseInt(year),
                    price: parseInt(price),
                    city,
                    condition,
                    vehicleType,
                    description
                })
            });
            
            const vehicleData = await vehicleResponse.json();
            
            if (!vehicleData.success) {
                throw new Error(vehicleData.message || 'Failed to create listing');
            }
            
            const vehicleId = vehicleData.vehicle._id;
            
            // Step 2: Upload images
            if (selectedImages.length > 0) {
                const imageFormData = new FormData();
                selectedImages.forEach(file => {
                    imageFormData.append('images', file);
                });
                
                const imageResponse = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/upload-images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: imageFormData
                });
                
                if (!imageResponse.ok) {
                    console.error('Image upload failed');
                }
            }
            
            // Step 3: Upload 3D model if selected
            const modelFile = document.getElementById('threeDModel').files[0];
            if (modelFile) {
                const modelFormData = new FormData();
                modelFormData.append('threeDModel', modelFile);
                
                const modelResponse = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/upload-model`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: modelFormData
                });
                
                if (!modelResponse.ok) {
                    console.error('3D model upload failed');
                }
            }
            
            showAlert('Vehicle listed successfully! It will be visible after admin approval.', 'success');
            
            setTimeout(() => {
                window.location.href = 'my-listings.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error creating listing:', error);
            showAlert(error.message || 'Failed to create listing', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show alert
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}