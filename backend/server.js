require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/planner', require('./routes/plannerRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));
app.use('/api/books', require('./routes/readingListRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve static files from the frontend public directory
const publicPath = path.join(__dirname, '../frontend/public');
app.use(express.static(publicPath));

// Catch-all route: serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
