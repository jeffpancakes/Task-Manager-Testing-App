import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api.js';

const emptyForm = {
  title: '',
  description: '',
  category: 'škola',
  priority: 'medium',
  dueDate: '',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filter, search]);

  function validateTask() {
    if (!form.title || form.title.trim().length < 3) return 'Název úkolu musí mít alespoň 3 znaky.';
    if (form.title.length > 100) return 'Název úkolu může mít maximálně 100 znaků.';
    if (form.dueDate && form.dueDate < new Date().toISOString().slice(0, 10)) return 'Termín nesmí být v minulosti.';
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    const validationMessage = validateTask();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await apiRequest(`/tasks/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await apiRequest('/tasks', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleCompleted(task) {
    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed }),
      });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(taskId) {
    const confirmed = window.confirm('Opravdu chcete tento úkol odstranit?');
    if (!confirmed) return;

    try {
      await apiRequest(`/tasks/${taskId}`, { method: 'DELETE' });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Seznam úkolů</h1>
          <p className="muted">CRUD operace, validace, loading stavy a filtrování pro testování.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card"><strong>{tasks.length}</strong><span>Celkem</span></div>
        <div className="stat-card"><strong>{completedCount}</strong><span>Dokončeno</span></div>
        <div className="stat-card"><strong>{tasks.length - completedCount}</strong><span>Nesplněno</span></div>
      </div>

      <form className="card task-form" onSubmit={handleSubmit} noValidate>
        <h2>{editingId ? 'Upravit úkol' : 'Vytvořit úkol'}</h2>
        {formError && <div className="alert error">{formError}</div>}

        <label>Název úkolu *</label>
        <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Např. Připravit testovací scénáře" />

        <label>Popis</label>
        <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Volitelný popis úkolu" />

        <div className="form-row">
          <div>
            <label>Kategorie</label>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option value="škola">Škola</option>
              <option value="práce">Práce</option>
              <option value="osobní">Osobní</option>
              <option value="ostatní">Ostatní</option>
            </select>
          </div>
          <div>
            <label>Priorita</label>
            <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option value="low">Nízká</option>
              <option value="medium">Střední</option>
              <option value="high">Vysoká</option>
            </select>
          </div>
          <div>
            <label>Termín</label>
            <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          </div>
        </div>

        <div className="button-row">
          <button className="primary" type="submit" disabled={saving}>{saving ? 'Ukládám...' : editingId ? 'Uložit změny' : 'Přidat úkol'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Zrušit úpravu</button>}
        </div>
      </form>

      <div className="toolbar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Hledat podle názvu..." />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">Všechny úkoly</option>
          <option value="open">Pouze nesplněné</option>
          <option value="completed">Pouze dokončené</option>
        </select>
      </div>

      {loading && <p className="muted">Načítám úkoly...</p>}
      {error && <div className="alert error">{error}</div>}
      {!loading && filteredTasks.length === 0 && <p className="empty-state">Žádné úkoly nebyly nalezeny.</p>}

      <div className="task-list">
        {filteredTasks.map((task) => (
          <article className={`card task-card ${task.completed ? 'completed' : ''}`} key={task.id}>
            <div className="task-main">
              <input type="checkbox" checked={task.completed} onChange={() => toggleCompleted(task)} aria-label={`Označit úkol ${task.title}`} />
              <div>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="meta">
                  <span>Kategorie: {task.category}</span>
                  <span>Priorita: {task.priority}</span>
                  {task.dueDate && <span>Termín: {task.dueDate}</span>}
                </div>
              </div>
            </div>
            <div className="button-row">
              <button type="button" onClick={() => startEdit(task)}>Upravit</button>
              <button className="danger" type="button" onClick={() => deleteTask(task.id)}>Odstranit</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
