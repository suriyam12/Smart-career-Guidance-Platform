const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/career_guidance')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Delete if exists
    await User.deleteOne({ email: 'saranyavenkat8165@gmail.com' });
    
    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const user = new User({
      name: 'SARANYA V',
      email: 'saranyavenkat8165@gmail.com',
      password: await bcrypt.hash('venkat', salt),
      role: 'admin'
    });
    
    await user.save();
    
    console.log('🎉 ADMIN USER CREATED SUCCESSFULLY!');
    console.log('📧 Email: saranyavenkat8165@gmail.com');
    console.log('🔑 Password: venkat');
    console.log('👑 Role: admin');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });