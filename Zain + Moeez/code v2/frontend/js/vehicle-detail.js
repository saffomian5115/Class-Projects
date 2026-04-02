let currentVehicle = null;
let scene, camera, renderer, model, controls;

// Get vehicle ID from URL
function getVehicleId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load vehicle details
async function loadVehicleDetails() {
    const vehicleId = getVehicleId();
    if (!vehicleId) {
        showError('No vehicle ID provided');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
        const data = await response.json();

        if (data.success) {
            currentVehicle = data.vehicle;
            displayVehicleDetails(currentVehicle);
            
            // Initialize 3D viewer if model exists
            if (currentVehicle.threeDModelUrl) {
                init3DViewer(currentVehicle.threeDModelUrl);
            } else {
                show3DPlaceholder();
            }
        } else {
            showError('Vehicle not found');
        }
    } catch (error) {
        console.error('Error loading vehicle:', error);
        showError('Failed to load vehicle details');
    }
}

// Display vehicle details
function displayVehicleDetails(vehicle) {
    const container = document.getElementById('vehicleDetail');
    
    container.innerHTML = `
        <div class="vehicle-detail-grid">
            <!-- Image Gallery -->
            <div class="image-gallery">
                <img id="mainImage" src="${vehicle.images && vehicle.images[0] ? vehicle.images[0] : 'https://via.placeholder.com/600x400?text=No+Image'}" 
                     alt="${vehicle.title}" class="main-image">
                <div class="thumbnail-grid" id="thumbnailGrid">
                    ${vehicle.images && vehicle.images.map((img, index) => `
                        <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
                    `).join('')}
                </div>
            </div>
            
            <!-- Vehicle Info -->
            <div class="vehicle-info-panel glass">
                <h1 class="vehicle-title-large">${vehicle.title}</h1>
                <div class="vehicle-price-large">
                    <i class="fas fa-rupee-sign"></i> ${formatPrice(vehicle.price)}
                </div>
                
                <div class="vehicle-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>Year: ${vehicle.year}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Condition: ${vehicle.condition}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-car"></i>
                        <span>Type: ${vehicle.vehicleType}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>Brand: ${vehicle.brand}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>City: ${vehicle.city}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-eye"></i>
                        <span>Views: ${vehicle.views}</span>
                    </div>
                </div>
                
                <div class="description">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p style="margin-top: 10px; line-height: 1.6;">${vehicle.description}</p>
                </div>
                
                <!-- Seller Info -->
                <div class="seller-card">
                    <div class="seller-info">
                        <div class="seller-avatar">
                            ${vehicle.sellerId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3>${vehicle.sellerId.name}</h3>
                            <p><i class="fas fa-phone"></i> ${vehicle.sellerId.phone}</p>
                            <p><i class="fas fa-envelope"></i> ${vehicle.sellerId.email}</p>
                        </div>
                    </div>
                    
                    ${isLoggedIn() && getCurrentUser()?.id !== vehicle.sellerId._id ? `
                        <div class="contact-form">
                            <textarea id="messageInput" placeholder="Ask about this vehicle..."></textarea>
                            <button onclick="openMessageModal()" class="neon-btn primary" style="margin-top: 10px; width: 100%;">
                                <i class="fas fa-paper-plane"></i> Send Message
                            </button>
                        </div>
                    ` : isLoggedIn() && getCurrentUser()?.id === vehicle.sellerId._id ? `
                        <div class="contact-form">
                            <p style="color: var(--primary-cyan);">
                                <i class="fas fa-info-circle"></i> This is your listing
                            </p>
                        </div>
                    ` : `
                        <div class="contact-form">
                            <p><a href="login.html" class="neon-btn secondary" style="width: 100%; text-align: center;">Login to Contact Seller</a></p>
                        </div>
                    `}
                </div>
            </div>
        </div>
        
        <!-- 3D Model Viewer Section -->
        <div style="margin-top: 40px;">
            <h2 class="section-title">3D <span class="neon-text">Preview</span></h2>
            <div id="modelViewerContainer" class="model-viewer-container">
                <div id="modelViewer" style="width: 100%; height: 400px;"></div>
                <div class="model-controls" id="modelControls" style="display: none;">
                    <button class="model-control-btn" onclick="resetCamera()"><i class="fas fa-sync-alt"></i></button>
                    <button class="model-control-btn" onclick="toggleWireframe()"><i class="fas fa-cube"></i></button>
                </div>
            </div>
        </div>
    `;
}

// Initialize 3D Viewer with Three.js
function init3DViewer(modelUrl) {
    const container = document.getElementById('modelViewer');
    if (!container) return;

    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.01);

    // Setup camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 0, 0);

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Setup controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    // Add lights
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.receiveShadow = true;
    scene.add(mainLight);

    // Fill light from below
    const fillLight = new THREE.PointLight(0x00ffff, 0.5);
    fillLight.position.set(0, -2, 0);
    scene.add(fillLight);

    // Back light
    const backLight = new THREE.PointLight(0xff00ff, 0.3);
    backLight.position.set(0, 2, -5);
    scene.add(backLight);

    // Neon rim lights
    const rimLight1 = new THREE.PointLight(0x00ffff, 0.5);
    rimLight1.position.set(3, 2, 3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xff00ff, 0.5);
    rimLight2.position.set(-3, 2, 3);
    scene.add(rimLight2);

    // Add helper grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x3366ff);
    gridHelper.position.y = -1.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // Load model
    const loader = new THREE.GLTFLoader();
    
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-spinner';
    loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading 3D Model...</p>';
    container.appendChild(loadingDiv);
    
    loader.load(
        modelUrl,
        (gltf) => {
            model = gltf.scene;
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    // Add neon material effect
                    if (node.material) {
                        node.material.metalness = 0.8;
                        node.material.roughness = 0.2;
                        node.material.emissive = new THREE.Color(0x00ffff);
                        node.material.emissiveIntensity = 0.1;
                    }
                }
            });
            scene.add(model);
            
            // Center model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y += 0.5;
            
            // Remove loading indicator
            loadingDiv.remove();
            document.getElementById('modelControls').style.display = 'flex';
            
            // Animate
            animate();
        },
        undefined,
        (error) => {
            console.error('Error loading model:', error);
            loadingDiv.innerHTML = '<p style="color: var(--neon-red);">Failed to load 3D model</p>';
            show3DPlaceholder();
        }
    );
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    function onWindowResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update controls (handles auto-rotate if enabled)
        renderer.render(scene, camera);
    }
}

// Show 3D placeholder
function show3DPlaceholder() {
    const container = document.getElementById('modelViewer');
    if (container) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #0a0a0a, #1a1a2e);">
                <div style="text-align: center;">
                    <i class="fas fa-cube" style="font-size: 4rem; color: var(--primary-cyan); margin-bottom: 20px; display: block;"></i>
                    <p>3D Model Coming Soon</p>
                    <p style="font-size: 0.8rem; opacity: 0.7;">Check back later for 3D preview</p>
                </div>
            </div>
        `;
    }
}

// Camera controls
function resetCamera() {
    if (camera && controls) {
        camera.position.set(5, 3, 8);
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

let wireframeMode = false;
function toggleWireframe() {
    if (model) {
        wireframeMode = !wireframeMode;
        model.traverse((node) => {
            if (node.isMesh) {
                node.material.wireframe = wireframeMode;
            }
        });
    }
}

// Change main image
function changeImage(src, element) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

// Open message modal
let currentSellerId = null;
let currentVehicleId = null;

function openMessageModal() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    currentSellerId = currentVehicle.sellerId._id;
    currentVehicleId = currentVehicle._id;
    document.getElementById('messageModal').classList.add('active');
}

// Send message
async function sendMessage() {
    const messageText = document.getElementById('messageText').value;
    if (!messageText.trim()) {
        showAlert('Please enter a message', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                vehicleId: currentVehicleId,
                message: messageText
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Message sent successfully!', 'success');
            closeModal();
            document.getElementById('messageText').value = '';
        } else {
            showAlert(data.message || 'Failed to send message', 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showAlert('Failed to send message', 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('messageModal').classList.remove('active');
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-PK').format(price);
}

// Show error
function showError(message) {
    const container = document.getElementById('vehicleDetail');
    container.innerHTML = `
        <div class="glass" style="text-align: center; padding: 50px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--neon-red); margin-bottom: 20px;"></i>
            <h3>Error</h3>
            <p>${message}</p>
            <a href="vehicles.html" class="neon-btn primary" style="margin-top: 20px;">Browse Vehicles</a>
        </div>
    `;
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
    alertDiv.style.maxWidth = '300px';
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadVehicleDetails();
});