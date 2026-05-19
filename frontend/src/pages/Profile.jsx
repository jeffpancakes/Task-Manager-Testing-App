import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

export default function Profile({ user, onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadProfile() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/profile');
      setProfile(data);
      setName(data.user.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name || name.trim().length < 2) {
      setError('Jméno musí mít alespoň 2 znaky.');
      return;
    }

    setSaving(true);
    try {
      const data = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      onProfileUpdate(data.user);
      setSuccess('Profil byl úspěšně uložen.');
      await loadProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Načítám profil...</p>;

  return (
    <section>
      <h1>Můj profil</h1>
      <p className="muted">Stránka pro zobrazení a úpravu uživatelských údajů.</p>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="profile-grid">
        <div className="card">
          <h2>Údaje uživatele</h2>
          <p><strong>Jméno:</strong> {profile.user.name}</p>
          <p><strong>E-mail:</strong> {profile.user.email}</p>
          <p><strong>Datum registrace:</strong> {new Date(profile.user.createdAt).toLocaleDateString('cs-CZ')}</p>
          <p><strong>ID uživatele:</strong> {profile.user.id}</p>
        </div>
        
        <div className="card">
          <h2>Statistiky</h2>
          <p><strong>Celkem úkolů:</strong> {profile.stats.totalTasks}</p>
          <p><strong>Splněno:</strong> {profile.stats.completedTasks}</p>
          <p><strong>Nesplněno:</strong> {profile.stats.openTasks}</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Upravit jméno uživatele</h2>
        <label>Jméno</label>
        <input value={name} onChange={(event) => setName(event.target.value)} />
        <button className="primary" type="submit" disabled={saving}>{saving ? 'Ukládám...' : 'Uložit profil'}</button>
      </form>
    </section>
  );
}
