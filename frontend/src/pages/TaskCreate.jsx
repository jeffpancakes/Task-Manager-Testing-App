import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { apiRequest } from '../api.js';
import TaskForm from '/components/TaskForm.jsx';
import { validateTaskInput } from '/utils/validation.js';

const emptyForm = {
  title: '',
  description: '',
  category: 'škola',
  priority: 'low',
  dueDate: '',
  completed: false,
};

export default function TaskCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

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
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      toast.success('Úkol byl vytvořen.');
      navigate('/tasks');
    } catch (err) {
      toast.error(`Nepodařilo se vytvořit úkol: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Vytvořit úkol</h1>
          <p className="muted">
            Stránka pro vytvoření nového úkolu.
          </p>
        </div>
      </div>

      <TaskForm
        form={form}
        setForm={setForm}
        editingId={null}
        saving={saving}
        formError={formError}
        onSubmit={handleSubmit}
        onCancelEdit={() => navigate('/tasks')}
      />
    </section>
  );
}