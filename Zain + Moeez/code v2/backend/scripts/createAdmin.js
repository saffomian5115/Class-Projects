const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }
        
        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@fourwheels.com',
            password: 'admin123',
            phone: '03000000000',
            city: 'Karachi',
            role: 'admin'
        });
        
        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@fourwheels.com');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();