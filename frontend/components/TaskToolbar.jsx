import React from 'react';

export default function TaskToolbar({ 
  search, 
  setSearch, 
  filter, 
  setFilter,
  sortBy,
  setSortBy
})

{  
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
        <option value="completed">Pouze splněné</option>
      </select>

      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
        <option value="createdAt-desc">Nejnovější</option>
        <option value="createdAt-asc">Nejstarší</option>
        <option value="dueDate-asc">Nejbližší termín</option>
        <option value="dueDate-desc">Nejvzdálenější termín</option>
        <option value="priority-asc">Nejnižší priorita</option>
        <option value="priority-desc">Nejvyšší priorita</option>
        <option value="title-asc">Abecedně (A-Z)</option>
      </select>
    </div>
  );
}