import React from 'react';

export default function TaskStats({ tasks }) {
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="dashboard-grid">
      <div className="stat-card">
        <strong>{tasks.length}</strong>
        <span>Celkem</span>
      </div>

      <div className="stat-card">
        <strong>{completedCount}</strong>
        <span>Dokončeno</span>
      </div>

      <div className="stat-card">
        <strong>{tasks.length - completedCount}</strong>
        <span>Nesplněno</span>
      </div>
    </div>
  );
}