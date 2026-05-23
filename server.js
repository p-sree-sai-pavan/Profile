const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ensure messages.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// POST endpoint for contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Simple validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields (name, email, message) are required.' });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    const messages = JSON.parse(fileData || '[]');

    const newMessage = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

    return res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ success: false, error: 'Server error. Failed to send message.' });
  }
});

// GET endpoint to retrieve messages (Admin Dashboard check)
app.get('/api/messages', (req, res) => {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    const messages = JSON.parse(fileData || '[]');
    // Sort by newest first
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error reading messages:', error);
    return res.status(500).json({ success: false, error: 'Server error. Failed to retrieve messages.' });
  }
});

// GET endpoint to delete a message (Admin capability)
app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    let messages = JSON.parse(fileData || '[]');
    
    const initialLength = messages.length;
    messages = messages.filter(msg => msg.id !== id);

    if (messages.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
    return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ success: false, error: 'Server error. Failed to delete message.' });
  }
});

// Fallback to index.html for single page navigation support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Portfolio server running at: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
