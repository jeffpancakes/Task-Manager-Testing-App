import React from 'react';

const labels = {
  high: 'Vysoká',
  medium: 'Střední',
  low: 'Nízká',
};

export default function TaskPriorityBadge({ priority }) {
  return (
    <span className={`priority-badge priority-${priority}`}>
      {labels[priority] || priority}
    </span>
  );
}