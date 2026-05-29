import express from 'express';

import { requireUserId } from '../middleware/authMiddleware.js';
import { readDb, writeDb } from '../services/dbService.js';
import { createId } from '../utils/createId.js';
import { validateTaskInput } from '../utils/validation.js';

const router = express.Router();

router.use(requireUserId);

router.get('/', async (req, res, next) => {
  try {
    const db = await readDb();

    const tasks = db.tasks.filter((task) => task.userId === req.userId);

    return res.json({ tasks });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description = '',
      category = 'ostatní',
      priority = 'medium',
      dueDate = '',
      completed = false,
    } = req.body;

    const validationMessage = validateTaskInput({ title, dueDate });

    if (validationMessage) {
      return res.status(400).json({
        message: validationMessage,
      });
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
      completed: Boolean(completed),
      createdAt: now,
      updatedAt: now,
    };

    db.tasks.push(task);
    await writeDb(db);

    return res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const db = await readDb();

    const task = db.tasks.find(
      (item) => item.id === req.params.id && item.userId === req.userId
    );

    if (!task) {
      return res.status(404).json({
        message: 'Úkol nebyl nalezen.',
      });
    }

    const { title, description, category, priority, dueDate, completed } = req.body;

    if (title !== undefined || dueDate !== undefined) {
      const validationMessage = validateTaskInput({
        title: title ?? task.title,
        dueDate: dueDate ?? task.dueDate,
      });

      if (validationMessage) {
        return res.status(400).json({
          message: validationMessage,
        });
      }
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = Boolean(completed);

    task.updatedAt = new Date().toISOString();

    await writeDb(db);

    return res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await readDb();

    const originalLength = db.tasks.length;

    db.tasks = db.tasks.filter(
      (task) => !(task.id === req.params.id && task.userId === req.userId)
    );

    if (db.tasks.length === originalLength) {
      return res.status(404).json({
        message: 'Úkol nebyl nalezen.',
      });
    }

    await writeDb(db);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;