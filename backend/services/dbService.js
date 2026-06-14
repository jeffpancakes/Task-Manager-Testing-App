import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE =
  process.env.NODE_ENV === 'test'
    ? 'db.test.json'
    : 'db.json';

const DB_PATH = path.join(DATA_DIR, DB_FILE);

export async function ensureDbFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(
      DB_PATH,
      JSON.stringify({ users: [], tasks: [] }, null, 2),
      'utf-8'
    );
  }
}

export async function readDb() {
  await ensureDbFile();

  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}