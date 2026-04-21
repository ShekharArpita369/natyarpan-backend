const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log(err));

// Comment Schema
const commentSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  message:   { type: String, required: true },
  play:      { type: String, required: true },  // e.g. 'HALFWAY', 'EXPIRY_DATE'
  createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema);

// POST — save a comment
app.post('/api/comments', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — load comments for a specific play
app.get('/api/comments', async (req, res) => {
  try {
    const { play } = req.query;
    const comments = await Comment.find({ play }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000 🎭'));