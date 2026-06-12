import React from 'react';

export default function TaskStats({ tasks }) {
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="dashboard-grid">
      <div className="stat-card-total">
        <strong>{tasks.length}</strong>
        <span>Celkem</span>
      </div>

      <div className="stat-card-complete">
        <strong>{completedCount}</strong>
        <span>Splněno</span>
      </div>

      <div className="stat-card-incomplete">
        <strong>{tasks.length - completedCount}</strong>
        <span>Nesplněno</span>
      </div>
    </div>
  );
}