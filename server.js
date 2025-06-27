import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const dbPromise = open({
  filename: path.join(__dirname, 'db.sqlite'),
  driver: sqlite3.Database
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

async function initDb() {
  const db = await dbPromise;
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
}

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const db = await dbPromise;
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hash);
    res.redirect('/login');
  } catch (err) {
    res.status(400).send('User already exists');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await dbPromise;
  const user = await db.get('SELECT * FROM users WHERE username = ?', username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    res.redirect('/');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const db = await dbPromise;
  const user = await db.get('SELECT username FROM users WHERE id = ?', req.session.userId);
  res.render('index', { user });
});

initDb().then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
