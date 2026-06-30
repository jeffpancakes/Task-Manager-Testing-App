export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateTaskInput({
  title,
  description,
  category,
  priority,
  dueDate,
}) {
  const allowedCategories = ['škola', 'práce', 'osobní', 'ostatní'];
  const allowedPriorities = ['low', 'medium', 'high'];

  if (!title || title.trim().length < 3) {
    return 'Název úkolu musí mít alespoň 3 znaky.';
  }

  if (title.length > 100) {
    return 'Název úkolu může mít maximálně 100 znaků.';
  }

  if (description && description.length > 500) {
    return 'Popis úkolu může mít maximálně 500 znaků.';
  }

  if (!category) {
    return 'Vyberte kategorii úkolu.';
  }

  if (!allowedCategories.includes(category)) {
    return 'Vyberte platnou kategorii úkolu.';
  }

  if (!priority) {
    return 'Vyberte prioritu úkolu.';
  }

  if (!allowedPriorities.includes(priority)) {
    return 'Vyberte platnou prioritu úkolu.';
  }

  if (dueDate && dueDate < new Date().toISOString().slice(0, 10)) {
    return 'Termín dokončení nesmí být v minulosti.';
  }

  return '';
}

export function validateProfileName(name) {
  if (!name || name.trim().length < 2) {
    return 'Jméno musí mít alespoň 2 znaky.';
  }

  if (name.length > 30) {
    return 'Jméno nesmí být delší než 30 znaků.';
  }

  return '';
}