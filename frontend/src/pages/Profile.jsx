import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { apiRequest } from '../api.js';
import Loader from '/components/Loader.jsx';

export default function Profile({ user, onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function loadProfile() {
    setLoading(true);

    try {
      const data = await apiRequest('/profile');

      setProfile(data);
      setName(data.user.name);
    } catch (err) {
      toast.error(`Nepodařilo se načíst profil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    if (!name || name.trim().length < 2) {
      setFormError('Jméno musí mít alespoň 2 znaky.');
      return;
    }

    setSaving(true);

    try {
      const data = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });

      onProfileUpdate(data.user);
      setProfile((currentProfile) => ({
        ...currentProfile,
        user: data.user,
      }));

      toast.success('Profil byl úspěšně uložen.');
    } catch (err) {
      toast.error(`Nepodařilo se uložit profil: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loader text="Načítám profil..." />;
  }

  if (!profile) {
    return (
      <section>
        <h1>Můj profil</h1>
        <p className="empty-state">
          Profil se nepodařilo načíst.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Můj profil</h1>
      <p className="muted">
        Stránka pro zobrazení a úpravu uživatelských údajů.
      </p>

      <div className="profile-grid">
        <div className="card">
          <h2>Údaje uživatele</h2>
          <p>
            <strong>Jméno:</strong> {profile.user.name}
          </p>
          <p>
            <strong>E-mail:</strong> {profile.user.email}
          </p>
          <p>
            <strong>Datum registrace:</strong>{' '}
            {new Date(profile.user.createdAt).toLocaleDateString('cs-CZ')}
          </p>
          <p>
            <strong>ID uživatele:</strong> {profile.user.id}
          </p>
        </div>

        <div className="card">
          <h2>Statistiky</h2>
          <p>
            <strong>Celkem úkolů:</strong> {profile.stats.totalTasks}
          </p>
          <p>
            <strong>Splněno:</strong> {profile.stats.completedTasks}
          </p>
          <p>
            <strong>Nesplněno:</strong> {profile.stats.openTasks}
          </p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Upravit jméno uživatele</h2>

        {formError && <div className="alert error">{formError}</div>}

        <label>Jméno</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <button className="primary" type="submit" disabled={saving}>
          {saving ? 'Ukládám...' : 'Uložit profil'}
        </button>
      </form>
    </section>
  );
}