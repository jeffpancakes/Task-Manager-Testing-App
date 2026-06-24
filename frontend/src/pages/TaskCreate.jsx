import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { apiRequest } from '../api.js';
import TaskForm from '/components/TaskForm.jsx';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  priority: '',
  dueDate: '',
  completed: false,
};

export default function TaskCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

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

    if (form.description && form.description.length > 500) {
      return 'Popis úkolu může mít maximálně 500 znaků.';
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