const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const token = localStorage.getItem('quanly-token');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(token),
    ...options
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || 'Lỗi API.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export async function fetchProfile() {
  return request('/auth/profile');
}

export async function getRooms() {
  return request('/rooms');
}

export async function createRoom(payload) {
  return request('/rooms', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateRoom(id, payload) {
  return request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteRoom(id) {
  return request(`/rooms/${id}`, { method: 'DELETE' });
}

export async function getDevices(roomId) {
  return request(`/devices${roomId ? `?roomId=${roomId}` : ''}`);
}

export async function createDevice(payload) {
  return request('/devices', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateDevice(id, payload) {
  return request(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteDevice(id) {
  return request(`/devices/${id}`, { method: 'DELETE' });
}

export async function updateDeviceStatus(id, status) {
  return request(`/devices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function getRepairs() {
  return request('/repairs');
}

export async function createRepair(payload) {
  return request('/repairs', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getReports() {
  return request('/reports');
}

export async function createReport(payload) {
  return request('/reports', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getAccounts() {
  return request('/accounts');
}

export async function createAccount(payload) {
  return request('/accounts', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateAccount(id, payload) {
  return request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function toggleAccountLock(id) {
  return request(`/accounts/${id}/lock`, { method: 'PATCH' });
}
