import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importação corrigida

export default function AdminApp() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin', { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token); // Agora usando jwtDecode
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/admin', { replace: true });
    }
  }, [navigate, token]);

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-app">
      <main>
        <Outlet />
      </main>
    </div>
  );
}