import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { apiRequest } from '../api.js';
import TaskForm from '/components/TaskForm.jsx';
import Loader from '/components/Loader.jsx';
import { validateTaskInput } from '/utils/validation.js';

const emptyForm = {
  title: '',
  description: '',
  category: 'škola',
  priority: 'low',
  dueDate: '',
  completed: false,
};

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function loadTask() {
      setLoading(true);

      try {
        const data = await apiRequest('/tasks');
        const foundTask = data.tasks.find((task) => task.id === id);

        if (!foundTask) {
          toast.error('Úkol nebyl nalezen.');
          navigate('/tasks');
          return;
        }

        setForm({
          title: foundTask.title,
          description: foundTask.description || '',
          category: foundTask.category,
          priority: foundTask.priority,
          dueDate: foundTask.dueDate || '',
          completed: foundTask.completed || false,
        });
      } catch (err) {
        toast.error(`Nepodařilo se načíst úkol: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const validationMessage = validateTaskInput(form);

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setSaving(true);

    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });

      toast.success('Úkol byl upraven.');
      navigate('/tasks');
    } catch (err) {
      toast.error(`Nepodařilo se upravit úkol: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loader text="Načítám úkol..." />;
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Upravení úkolu</h1>
          <p className="muted">
            Stránka pro editaci úkolu.
          </p>
        </div>
      </div>

      <TaskForm
        form={form}
        setForm={setForm}
        editingId={id}
        saving={saving}
        formError={formError}
        onSubmit={handleSubmit}
        onCancelEdit={() => navigate('/tasks')}
      />
    </section>
  );
}