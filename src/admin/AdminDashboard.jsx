import React from 'react';
import { Navigate } from 'react-router-dom';
import Portfolio from '../components/Portifolio/Portifolio';
import Certificacoes from '../components/Certificados/Certificados';

export default function AdminDashboard() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-dashboard">
        <Portfolio isAdmin={true} />
        <Certificacoes isAdmin={true} />
      </div>
  );
}