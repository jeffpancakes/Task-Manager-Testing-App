import React from 'react';

export default function TaskCategoryBadge({ category }) {
  return (
    <span className={`category-badge category-${category}`}>
      {category}
    </span>
  );
}