import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { apiRequest } from '../api.js';
import TaskForm from '/components/TaskForm.jsx';
import TaskItem from '/components/TaskItem.jsx';
import TaskStats from '/components/TaskStats.jsx';
import TaskToolbar from '/components/TaskToolbar.jsx';
import Loader from '/components/Loader.jsx';

const emptyForm = {
  title: '',
  description: '',
  category: 'škola',
  priority: 'medium',
  dueDate: '',
  completed: false,
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function loadTasks() {
    setLoading(true);

    try {
      const data = await apiRequest('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      toast.error(`Nepodařilo se načíst úkoly: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filter === 'all' ||
        (filter === 'completed' ? task.completed : !task.completed);

      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [tasks, filter, search]);

  function validateTask() {
    if (!form.title || form.title.trim().length < 3) {
      return 'Název úkolu musí mít alespoň 3 znaky.';
    }

    if (form.title.length > 100) {
      return 'Název úkolu může mít maximálně 100 znaků.';
    }

    if (form.dueDate && form.dueDate < new Date().toISOString().slice(0, 10)) {
      return 'Termín nesmí být v minulosti.';
    }

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
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setForm(emptyForm);
      toast.success('Úkol byl vytvořen.');
      await loadTasks();
    } catch (err) {
      toast.error(`Nepodařilo se vytvořit úkol: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function toggleCompleted(task) {
    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed }),
      });

      toast.success(
        task.completed
          ? 'Úkol byl označen jako nesplněný.'
          : 'Úkol byl označen jako dokončený.'
      );

      await loadTasks();
    } catch (err) {
      toast.error(`Nepodařilo se změnit stav úkolu: ${err.message}`);
    }
  }

  async function deleteTask(taskId) {
    const confirmed = window.confirm('Opravdu chcete tento úkol odstranit?');

    if (!confirmed) return;

    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE',
      });

      toast.success('Úkol byl odstraněn.');
      await loadTasks();
    } catch (err) {
      toast.error(`Nepodařilo se odstranit úkol: ${err.message}`);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Seznam úkolů</h1>
          <p className="muted">
            CRUD operace, validace, loading stavy a filtrování pro testování.
          </p>
        </div>
      </div>

      <TaskStats tasks={tasks} />

      <TaskForm
        form={form}
        setForm={setForm}
        editingId={null}
        saving={saving}
        formError={formError}
        onSubmit={handleSubmit}
        onCancelEdit={() => {}}
      />

      <TaskToolbar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {loading && <Loader text="Načítám úkoly..." />}

      {!loading && filteredTasks.length === 0 && (
        <p className="empty-state">Žádné úkoly nebyly nalezeny.</p>
      )}

      <div className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleCompleted={toggleCompleted}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </section>
  );
}