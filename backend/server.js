import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

import delayMiddleware from './middleware/delayMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(delayMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager Testing API běží.' });
});

app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/tasks', taskRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Backend běží na http://localhost:${PORT}`);
});