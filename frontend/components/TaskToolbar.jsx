import React from 'react';

export default function TaskToolbar({ search, setSearch, filter, setFilter }) {
  return (
    <div className="toolbar">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Hledat podle názvu..."
      />

      <select value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="all">Všechny úkoly</option>
        <option value="open">Pouze nesplněné</option>
        <option value="completed">Pouze dokončené</option>
      </select>
    </div>
  );
}