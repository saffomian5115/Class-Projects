// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    checkAuth();
});

// Update navbar based on login status
function updateNavbar() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const authBtn = document.getElementById('authBtn');
    const addListingNav = document.getElementById('addListingNav');
    const myListingsNav = document.getElementById('myListingsNav');
    const profileNav = document.getElementById('profileNav');
    
    if (token && user) {
        // User is logged in
        if (authBtn) {
            authBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            authBtn.href = "#";
            authBtn.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        }
        
        // Show seller links if user is seller or admin
        if (addListingNav && (user.role === 'seller' || user.role === 'admin')) {
            addListingNav.style.display = 'block';
            addListingNav.href = 'add-listing.html';
        } else if (addListingNav) {
            addListingNav.style.display = 'none';
        }
        
        if (myListingsNav && (user.role === 'seller' || user.role === 'admin')) {
            myListingsNav.style.display = 'block';
            myListingsNav.href = 'my-listings.html';
        } else if (myListingsNav) {
            myListingsNav.style.display = 'none';
        }
        
        if (profileNav) {
            profileNav.style.display = 'block';
            profileNav.href = 'profile.html';
        }
        
        // Show admin panel link if admin
        if (user.role === 'admin') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && !document.getElementById('adminLink')) {
                const adminLink = document.createElement('a');
                adminLink.id = 'adminLink';
                adminLink.href = 'admin/dashboard.html';
                adminLink.innerHTML = '<i class="fas fa-crown"></i> Admin';
                adminLink.style.color = 'var(--primary-magenta)';
                navLinks.insertBefore(adminLink, authBtn);
            }
        }
    } else {
        // User is logged out
        if (authBtn) {
            authBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
            authBtn.href = "login.html";
            authBtn.onclick = null;
        }
        
        if (addListingNav) addListingNav.style.display = 'none';
        if (myListingsNav) myListingsNav.style.display = 'none';
        if (profileNav) profileNav.style.display = 'none';
        
        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.remove();
    }
}

// Check authentication and redirect
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['add-listing.html', 'my-listings.html', 'profile.html'];
    const adminPages = ['admin/dashboard.html', 'admin/manage-users.html', 'admin/manage-vehicles.html'];
    
    // Check if current page is protected
    if (protectedPages.includes(currentPage) && !token) {
        showAlert('Please login to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    // Check admin pages
    if (adminPages.some(page => currentPage.includes(page))) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!token || user.role !== 'admin') {
            showAlert('Admin access required', 'error');
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 2000);
            return false;
        }
    }
    
    return true;
}

// Login function
async function login(email, password) {
    try {
        const response = await api.auth.login({ email, password });
        
        if (response.success) {
            // Save token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (response.user.role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
        } else {
            showAlert(response.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Something went wrong. Please try again.', 'error');
    }
}

// Signup function
async function signup(userData) {
    try {
        const response = await api.auth.register(userData);
        
        if (response.success) {
            showAlert('Account created successfully! Please login.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(response.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAlert('Something went wrong. Please try again.', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Show alert message
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        
        await login(email, password);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Handle signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!name || !email || !phone || !city || !password) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;
        
        await signup({ name, email, phone, city, role, password });
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Check if user is seller
function isSeller() {
    const user = getCurrentUser();
    return user && (user.role === 'seller' || user.role === 'admin');
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}