import React, { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Tasks from './pages/Tasks.jsx';
import Profile from './pages/Profile.jsx';

import Navbar from '/components/Navbar.jsx';
import ProtectedRoute from '/components/ProtectedRoute.jsx';

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const navigate = useNavigate();

  function handleLogin(loggedUser) {
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    navigate('/tasks');
  }

  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  function handleProfileUpdate(updatedUser) {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? '/tasks' : '/login'} replace />}
          />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route
            path="/register"
            element={<Register onRegister={handleLogin} />}
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute user={user}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} onProfileUpdate={handleProfileUpdate} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}