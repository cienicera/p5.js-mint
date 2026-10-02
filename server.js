const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for sketches (session-based)
const sketchStore = new Map();

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get sketch by ID
app.get('/api/sketch/:id', (req, res) => {
  const sketch = sketchStore.get(req.params.id);
  if (sketch) {
    res.json(sketch);
  } else {
    res.status(404).json({ error: 'Sketch not found' });
  }
});

// API: Create or update sketch
app.post('/api/sketch', (req, res) => {
  const { id, code, author, timestamp } = req.body;
  sketchStore.set(id, { code, author, timestamp });
  res.json({ success: true, id });
});

// API: List all sketches
app.get('/api/sketches', (req, res) => {
  const sketches = Array.from(sketchStore.entries()).map(([id, data]) => ({ id, ...data }));
  res.json(sketches);
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
