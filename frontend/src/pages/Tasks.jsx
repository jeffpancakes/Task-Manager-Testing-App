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
  category: '',
  priority: '',
  dueDate: '',
  completed: false,
};

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1
};


export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');

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

const visibleTasks = useMemo(() => {
  const filtered = tasks.filter((task) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'completed' ? task.completed : !task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'createdAt-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === 'createdAt-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === 'dueDate-asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (sortBy === 'dueDate-desc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }

    if (sortBy === 'priority-desc') {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortBy === 'priority-asc') {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title, 'cs');
    }

    return 0;
  });
}, [tasks, filter, search, sortBy]);

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
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading && <Loader text="Načítám úkoly..." />}

      {!loading && visibleTasks.length === 0 && (
        <p className="empty-state">Žádné úkoly nebyly nalezeny.</p>
      )}

      <div className="task-list">
        {visibleTasks.map((task) => (
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