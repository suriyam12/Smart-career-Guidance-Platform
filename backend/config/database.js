const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kongu');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
// Add this temporary route to check database
app.get('/api/debug/db', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    database: mongoose.connection.db.databaseName,
    connected: mongoose.connection.readyState === 1
  });
});
module.exports = connectDB;