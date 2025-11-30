import express from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// CORS: allow frontend on localhost and LAN
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.27:3000'],
  credentials: true
}));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,   // must be false for HTTP (not HTTPS)
    sameSite: 'none', // allows cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Mock user database
const users = [
  { id: 1, username: 'test', password: '1234', learningStyle: 'visual' }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if(user){
(req.session as any).user = { id: user.id, username: user.username, learningStyle: user.learningStyle };
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Check login status
app.get('/me', (req, res) => {
  if((req.session as any).user){
    return res.json((req.session as any).user);
  }
  res.status(401).json({ message: 'Not logged in' });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Listen on all interfaces (LAN + localhost)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
