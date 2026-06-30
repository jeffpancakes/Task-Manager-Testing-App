import React from 'react';

export default function TaskStatusBadge({ completed }) {
  return (
    <span className={`status-badge ${completed ? 'completed' : 'pending'}`}>
      {completed ? 'Dokončeno' : 'Probíhá'}
    </span>
  );
}