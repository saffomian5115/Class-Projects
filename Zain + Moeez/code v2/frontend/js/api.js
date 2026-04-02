const API_BASE_URL = 'http://localhost:5000/api';

// API Helper Functions
const api = {
    // Auth endpoints
    auth: {
        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return response.json();
        },
        
        login: async (credentials) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            return response.json();
        },
        
        getProfile: async (token) => {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        }
    },
    
    // Vehicle endpoints
    vehicles: {
        getAll: async (filters = {}) => {
            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_BASE_URL}/vehicles?${queryString}`);
            return response.json();
        },
        
        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
            return response.json();
        },
        
        create: async (vehicleData, token) => {
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });
            return response.json();
        },
        
        update: async (id, vehicleData, token) => {
            const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });
            return response.json();
        },
        
        delete: async (id, token) => {
            const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        }
    },
    
    // Admin endpoints
    admin: {
        getAllUsers: async (token) => {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        },
        
        deleteUser: async (userId, token) => {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        },
        
        getAllVehicles: async (token) => {
            const response = await fetch(`${API_BASE_URL}/admin/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        },
        
        approveVehicle: async (vehicleId, token) => {
            const response = await fetch(`${API_BASE_URL}/admin/vehicles/${vehicleId}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        },
        
        deleteVehicle: async (vehicleId, token) => {
            const response = await fetch(`${API_BASE_URL}/admin/vehicles/${vehicleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        }
    }
};

// Helper to get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Helper to check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Helper to get user role
function getUserRole() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || null;
}