import React from 'react';

export default function TaskForm({
  form,
  setForm,
  editingId,
  saving,
  formError,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <form className="card task-form" onSubmit={onSubmit} noValidate>
      <h2>{editingId ? 'Upravit úkol' : 'Vytvořit úkol'}</h2>

      {formError && <div className="alert error">{formError}</div>}

      <label>Název*</label>
      <input
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        placeholder="Např. Připravit testovací scénáře"
      />

      <label>Popis</label>
      <textarea
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.target.value })}
        placeholder="Volitelný popis úkolu"
      />

      <div className="form-row">
        <div>
          <label>Kategorie</label>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            <option value="škola">Škola</option>
            <option value="práce">Práce</option>
            <option value="osobní">Osobní</option>
            <option value="ostatní">Ostatní</option>
          </select>
        </div>

        <div>
          <label>Priorita</label>
          <select
            value={form.priority}
            onChange={(event) => setForm({ ...form, priority: event.target.value })}
          >
            <option value="low">Nízká</option>
            <option value="medium">Střední</option>
            <option value="high">Vysoká</option>
          </select>
        </div>

        <div>
          <label>Termín</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
          />
        </div>
      </div>

      <div className="checkbox-field">
        <input
          id="completed"
          type="checkbox"
          checked={form.completed || false}
          onChange={(event) =>
            setForm({ ...form, completed: event.target.checked })
          }
        />

        <label htmlFor="completed">
          Označit úkol jako splněný (lze změnit i později)
        </label>
      </div>

      <div className="button-row">
        <button className="primary" type="submit" disabled={saving}>
          {saving ? 'Ukládám...' : editingId ? 'Uložit změny' : 'Přidat úkol'}
        </button>

        {editingId && (
          <button type="button" onClick={onCancelEdit}>
            Zrušit úpravu
          </button>
        )}
      </div>
    </form>
  );
}