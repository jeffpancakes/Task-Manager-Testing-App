import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.js';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!form.email) nextErrors.email = 'Email je povinný.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Email není ve správném formátu.';
    if (!form.password) nextErrors.password = 'Heslo je povinné.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onLogin(data.user);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card auth-card">
      <h1>Přihlášení</h1>
      <p className="muted">Přihlaste se do svého účtu.</p>
      {apiError && <div className="alert error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <label>E-mail</label>
        <input
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Váš e-mail"
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label>Heslo</label>
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Vaše heslo"
        />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <button className="primary" disabled={loading} type="submit">
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>

      <p className="switch-text">Nemáte účet? <Link to="/register">Zaregistrujte se</Link></p>
    </section>
  );
}
