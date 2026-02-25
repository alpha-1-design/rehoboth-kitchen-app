require('dotenv').config();
const bcrypt = require('bcryptjs');
const { usersDB } = require('./db');

const createAdmin = async () => {
  try {
    // Check if admin exists
    const existing = await usersDB.findOne({ email: 'gracee14gn@gmail.com' });
    if (existing) {
      console.log('Admin already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash('Grace2025!', 10);
    
    const admin = {
      name: 'Grace Uddih',
      email: 'gracee14gn@gmail.com',
      phone: '0200159500',
      password: hashedPassword,
      avatar: '',
      ghanaPost: '',
      momoNumber: '',
      region: 'Ahanti Region',
      isAdmin: true,
      createdAt: new Date()
    };

    await usersDB.insert(admin);
    console.log('✅ Admin account created!');
    console.log('Email: gracee14gn@gmail.com');
    console.log('Password: Grace2025!');
    console.log('\n⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
