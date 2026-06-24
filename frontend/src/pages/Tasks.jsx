import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { apiRequest } from '../api.js';
import TaskItem from '/components/TaskItem.jsx';
import TaskStats from '/components/TaskStats.jsx';
import TaskToolbar from '/components/TaskToolbar.jsx';
import Loader from '/components/Loader.jsx';

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [loading, setLoading] = useState(true);

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
            CRUD operace, validace, loading stavy, filtrování a řazení pro testování.
          </p>
        </div>

        <Link className="button-link primary-link" to="/tasks/create">
          Vytvořit úkol
        </Link>
      </div>

      <TaskStats tasks={tasks} />

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