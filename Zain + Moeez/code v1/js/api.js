/* ============================================
   FOUR WHEELS — API SERVICE JS
   Connects Frontend to Backend REST API
   Place this file in: /js/api.js
   ============================================ */

const API_BASE = 'http://localhost:5000/api';

// ===== HELPERS =====
function getToken() {
  return localStorage.getItem('fw_token');
}

function authHeaders(json = true) {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ===== AUTH API =====
window.AuthAPI = {

  async register(payload) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    // Save token & user
    localStorage.setItem('fw_token', data.token);
    localStorage.setItem('fw_user',  JSON.stringify(data.user));
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    localStorage.setItem('fw_token', data.token);
    localStorage.setItem('fw_user',  JSON.stringify(data.user));
    return data;
  },

  async me() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method:  'PUT',
      headers: authHeaders(),
      body:    JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  logout() {
    localStorage.removeItem('fw_token');
    localStorage.removeItem('fw_user');
    window.location.href = '/pages/login.html';
  },
};

// ===== VEHICLES API =====
window.VehicleAPI = {

  async getAll(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/vehicles?${qs}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async getById(id) {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async getMy() {
    const res = await fetch(`${API_BASE}/vehicles/my`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async create(payload) {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async update(id, payload) {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method:  'PUT',
      headers: authHeaders(),
      body:    JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method:  'DELETE',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async uploadImages(id, formData) {
    const res = await fetch(`${API_BASE}/vehicles/${id}/images`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }, // no Content-Type for FormData
      body:    formData,
    });
    return handleResponse(res);
  },
};

// ===== USERS API =====
window.UserAPI = {

  async getProfile() {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(payload) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method:  'PUT',
      headers: authHeaders(),
      body:    JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async uploadAvatar(formData) {
    const res = await fetch(`${API_BASE}/users/avatar`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body:    formData,
    });
    return handleResponse(res);
  },

  async getSaved() {
    const res = await fetch(`${API_BASE}/users/saved`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async saveVehicle(vehicleId) {
    const res = await fetch(`${API_BASE}/users/saved/${vehicleId}`, {
      method:  'POST',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async unsaveVehicle(vehicleId) {
    const res = await fetch(`${API_BASE}/users/saved/${vehicleId}`, {
      method:  'DELETE',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};

// ===== MESSAGES API =====
window.MessageAPI = {

  async send(receiverId, vehicleId, text) {
    const res = await fetch(`${API_BASE}/messages`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ receiverId, vehicleId, text }),
    });
    return handleResponse(res);
  },

  async getInbox() {
    const res = await fetch(`${API_BASE}/messages/inbox`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async getThread(vehicleId, userId) {
    const res = await fetch(`${API_BASE}/messages/${vehicleId}/${userId}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async markRead(senderId) {
    const res = await fetch(`${API_BASE}/messages/read/${senderId}`, {
      method:  'PUT',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};

// ===== ADMIN API =====
window.AdminAPI = {

  async getStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async getUsers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/users?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async updateUser(id, payload) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async getVehicles(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/vehicles?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async setVehicleStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/vehicles/${id}/status`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async updateVehicle(id, payload) {
    const res = await fetch(`${API_BASE}/admin/vehicles/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteVehicle(id) {
    const res = await fetch(`${API_BASE}/admin/vehicles/${id}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    return handleResponse(res);
  },
};

console.log('✅ Four Wheels API Service loaded');
