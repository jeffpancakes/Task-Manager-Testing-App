import React from 'react';
import { Link } from 'react-router-dom';

import TaskStatusBadge from './TaskStatusBadge.jsx';
import TaskPriorityBadge from './TaskPriorityBadge.jsx';
import TaskCategoryBadge from './TaskCategoryBadge.jsx';

function isOverdue(task) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    task.dueDate &&
    task.dueDate < today &&
    !task.completed
  );
}

export default function TaskItem({
  task,
  onToggleCompleted,
  onDelete,
}) {
  const overdue = isOverdue(task);

  return (
    <article
      className={`
        card
        task-card
        ${task.completed ? 'completed' : 'pending'}
        ${overdue ? 'overdue' : ''}
      `}
    >
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleCompleted(task)}
          aria-label={`Označit úkol ${task.title}`}
        />

        <div className="task-content">
          <div className="task-header">
            <h3>{task.title}</h3>

            <TaskStatusBadge
              completed={task.completed}
            />
          </div>

          {task.description && (
            <p>{task.description}</p>
          )}

          <div className="meta">
            <TaskCategoryBadge
              category={task.category}
            />

            <TaskPriorityBadge
              priority={task.priority}
            />

            {task.dueDate && (
              <span
                className={
                  overdue
                    ? 'due-date overdue-text'
                    : 'due-date'
                }
              >
                Termín: {task.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="button-row">
        <Link
          className="button-link"
          to={`/tasks/${task.id}/edit`}
        >
          Upravit
        </Link>

        <button
          className="danger"
          type="button"
          onClick={() => onDelete(task.id)}
        >
          Odstranit
        </button>
      </div>
    </article>
  );
}