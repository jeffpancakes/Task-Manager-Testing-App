export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateTaskInput({ title, dueDate }) {
  if (!title || title.trim().length < 3) {
    return 'Název úkolu musí mít alespoň 3 znaky.';
  }

  if (title.length > 100) {
    return 'Název úkolu může mít maximálně 100 znaků.';
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

  return '';
}