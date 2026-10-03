const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'deepak@second-innings.in';
    let admin = await Admin.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }

    // Also check if old gmail admin exists, update or create new
    const oldAdmin = await Admin.findOne({ email: 'deepaksogani18@gmail.com' });
    if (oldAdmin) {
      oldAdmin.email = adminEmail;
      await oldAdmin.save();
      console.log(`Updated existing admin to professional email: ${adminEmail}`);
      process.exit(0);
    }

    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'SecondInnings@2026';

    admin = new Admin({
      name: 'Deepak Sogani',
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin'
    });

    await admin.save();

    console.log('Superadmin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log('Password has been securely configured.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
