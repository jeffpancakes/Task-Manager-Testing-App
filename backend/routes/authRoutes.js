import express from 'express';
import bcrypt from 'bcryptjs';

import { readDb, writeDb } from '../services/dbService.js';
import { createId } from '../utils/createId.js';
import { publicUser } from '../utils/userUtils.js';
import { isValidEmail } from '../utils/validation.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        message: 'Vyplňte všechna povinná pole.',
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        message: 'Jméno musí mít alespoň 2 znaky.',
      });
    }

    if (name.trim().length > 30) {
      return res.status(400).json({
        message: 'Jméno nesmí být delší než 30 znaků.', 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Zadejte platný email.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Heslo musí mít alespoň 8 znaků.',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        message: 'Hesla se neshodují.',
      });
    }

    const db = await readDb();

    const exists = db.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        message: 'Uživatel s tímto emailem už existuje.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: createId('u'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    await writeDb(db);

    return res.status(201).json({
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Vyplňte email a heslo.',
      });
    }

    const db = await readDb();

    const user = db.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: 'Neplatný email nebo heslo.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Neplatný email nebo heslo.',
      });
    }

    return res.json({
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

export default router;