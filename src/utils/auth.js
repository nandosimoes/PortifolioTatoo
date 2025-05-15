// src/utils/auth.js
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwt.decode(token);
    return decoded && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/admin';
}