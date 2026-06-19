import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.js';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!form.name || form.name.trim().length < 2) nextErrors.name = 'Jméno musí mít alespoň 2 znaky.';
    if (form.name.trim().length > 30) nextErrors.name = 'Jméno nesmí být delší než 30 znaků.';
    if (!form.email) nextErrors.email = 'Email je povinný.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Email není ve správném formátu.';
    if (!form.password || form.password.length < 8) nextErrors.password = 'Heslo musí mít alespoň 8 znaků.';
    if (form.passwordConfirm !== form.password) nextErrors.passwordConfirm = 'Hesla se neshodují.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onRegister(data.user);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card auth-card">
      <h1>Registrace</h1>
      <p className="muted">Vytvořte si nový účet pro správu vlastních úkolů.</p>
      {apiError && <div className="alert error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <label>Jméno</label>
        <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Jan Novák" />
        {errors.name && <p className="field-error">{errors.name}</p>}

        <label>Email</label>
        <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="jan@example.cz" />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label>Heslo</label>
        <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Vaše heslo" />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <label>Potvrzení hesla</label>
        <input type="password" value={form.passwordConfirm} onChange={(event) => setForm({ ...form, passwordConfirm: event.target.value })} placeholder="Potvrzení hesla" />
        {errors.passwordConfirm && <p className="field-error">{errors.passwordConfirm}</p>}

        <button className="primary" disabled={loading} type="submit">
          {loading ? 'Registruji...' : 'Zaregistrovat se'}
        </button>
      </form>

      <p className="switch-text">Už máte účet? <Link to="/login">Přihlaste se</Link></p>
    </section>
  );
}
