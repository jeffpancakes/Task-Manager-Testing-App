import express from 'express';

import { requireUserId } from '../middleware/authMiddleware.js';
import { readDb, writeDb } from '../services/dbService.js';
import { publicUser } from '../utils/userUtils.js';
import { validateProfileName } from '../utils/validation.js';

const router = express.Router();

router.use(requireUserId);

router.get('/', async (req, res, next) => {
  try {
    const db = await readDb();

    const user = db.users.find((item) => item.id === req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Uživatel nebyl nalezen.',
      });
    }

    const userTasks = db.tasks.filter((task) => task.userId === req.userId);

    return res.json({
      user: publicUser(user),
      stats: {
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter((task) => task.completed).length,
        openTasks: userTasks.filter((task) => !task.completed).length,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { name } = req.body;

    const validationMessage = validateProfileName(name);

    if (validationMessage) {
      return res.status(400).json({
        message: validationMessage,
      });
    }

    const db = await readDb();

    const user = db.users.find((item) => item.id === req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Uživatel nebyl nalezen.',
      });
    }

    user.name = name.trim();

    await writeDb(db);

    return res.json({
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

export default router;