import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="topbar">
      <Link className="logo" to={user ? '/tasks' : '/login'}>
        Task Manager App
      </Link>

      {user && (
        <nav className="nav">
          <Link to="/tasks">Úkoly</Link>
          <Link to="/profile">Profil</Link>
          <button type="button" onClick={onLogout}>
            Odhlásit
          </button>
        </nav>
      )}
    </header>
  );
}