import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulace pomalejšího API. Díky tomu lze testovat loading stavy ve frontendu.
app.use(async (req, res, next) => {
  const delay = 500 + Math.floor(Math.random() * 501);
  await new Promise((resolve) => setTimeout(resolve, delay));
  next();
});

async function readDb() {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function requireUserId(req, res, next) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res.status(401).json({ message: 'Uživatel není přihlášen.' });
  }
  req.userId = userId;
  next();
}

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager Testing API běží.' });
});

app.post('/register', async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: 'Vyplňte všechna povinná pole.' });
  }
  if (name.trim().length < 2) {
    return res.status(400).json({ message: 'Jméno musí mít alespoň 2 znaky.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Zadejte platný email.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Heslo musí mít alespoň 8 znaků.' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Hesla se neshodují.' });
  }

  const db = await readDb();
  const exists = db.users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Uživatel s tímto emailem už existuje.' });
  }

  const user = {
    id: createId('u'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);

  res.status(201).json({ user: publicUser(user) });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vyplňte email a heslo.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Zadejte platný email.' });
  }

  const db = await readDb();
  const user = db.users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: 'Nesprávný email nebo heslo.' });
  }

  res.json({ user: publicUser(user) });
});

app.get('/profile', requireUserId, async (req, res) => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === req.userId);
  if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen.' });

  const userTasks = db.tasks.filter((task) => task.userId === req.userId);
  res.json({
    user: publicUser(user),
    stats: {
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter((task) => task.completed).length,
      openTasks: userTasks.filter((task) => !task.completed).length,
    },
  });
});

app.put('/profile', requireUserId, async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Jméno musí mít alespoň 2 znaky.' });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.id === req.userId);
  if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen.' });

  user.name = name.trim();
  await writeDb(db);
  res.json({ user: publicUser(user) });
});

app.get('/tasks', requireUserId, async (req, res) => {
  const db = await readDb();
  const tasks = db.tasks.filter((task) => task.userId === req.userId);
  res.json({ tasks });
});

app.post('/tasks', requireUserId, async (req, res) => {
  const { title, description = '', category = 'ostatní', priority = 'medium', dueDate = '' } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Název úkolu musí mít alespoň 3 znaky.' });
  }
  if (title.length > 100) {
    return res.status(400).json({ message: 'Název úkolu může mít maximálně 100 znaků.' });
  }
  if (dueDate && dueDate < new Date().toISOString().slice(0, 10)) {
    return res.status(400).json({ message: 'Termín dokončení nesmí být v minulosti.' });
  }

  const db = await readDb();
  const now = new Date().toISOString();
  const task = {
    id: createId('t'),
    userId: req.userId,
    title: title.trim(),
    description: description.trim(),
    category,
    priority,
    dueDate,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.push(task);
  await writeDb(db);
  res.status(201).json({ task });
});

app.put('/tasks/:id', requireUserId, async (req, res) => {
  const db = await readDb();
  const task = db.tasks.find((item) => item.id === req.params.id && item.userId === req.userId);
  if (!task) return res.status(404).json({ message: 'Úkol nebyl nalezen.' });

  const { title, description, category, priority, dueDate, completed } = req.body;

  if (title !== undefined) {
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Název úkolu musí mít alespoň 3 znaky.' });
    }
    task.title = title.trim();
  }

  if (description !== undefined) task.description = description.trim();
  if (category !== undefined) task.category = category;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) {
    if (dueDate && dueDate < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ message: 'Termín dokončení nesmí být v minulosti.' });
    }
    task.dueDate = dueDate;
  }
  if (completed !== undefined) task.completed = Boolean(completed);

  task.updatedAt = new Date().toISOString();
  await writeDb(db);
  res.json({ task });
});

app.delete('/tasks/:id', requireUserId, async (req, res) => {
  const db = await readDb();
  const originalLength = db.tasks.length;
  db.tasks = db.tasks.filter((task) => !(task.id === req.params.id && task.userId === req.userId));

  if (db.tasks.length === originalLength) {
    return res.status(404).json({ message: 'Úkol nebyl nalezen.' });
  }

  await writeDb(db);
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Nastala neočekávaná chyba serveru.' });
});

app.listen(PORT, () => {
  console.log(`Backend běží na http://localhost:${PORT}`);
});
