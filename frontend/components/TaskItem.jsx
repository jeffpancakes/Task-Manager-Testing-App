import React from 'react';

export default function TaskItem({ task, onToggleCompleted, onEdit, onDelete }) {
  return (
    <article className={`card task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleCompleted(task)}
          aria-label={`Označit úkol ${task.title}`}
        />

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
        <button type="button" onClick={() => onEdit(task)}>
          Upravit
        </button>

        <button className="danger" type="button" onClick={() => onDelete(task.id)}>
          Odstranit
        </button>
      </div>
    </article>
  );
}