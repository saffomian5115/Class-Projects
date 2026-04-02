const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

dotenv.config();

const testAPI = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('\n📊 Testing Database Connection...\n');
        
        // Count users
        const userCount = await User.countDocuments();
        console.log(`✅ Total Users: ${userCount}`);
        
        // Count vehicles
        const vehicleCount = await Vehicle.countDocuments();
        console.log(`✅ Total Vehicles: ${vehicleCount}`);
        
        // Count by status
        const pendingVehicles = await Vehicle.countDocuments({ status: 'pending' });
        const approvedVehicles = await Vehicle.countDocuments({ status: 'approved' });
        console.log(`✅ Pending Vehicles: ${pendingVehicles}`);
        console.log(`✅ Approved Vehicles: ${approvedVehicles}`);
        
        // Get admin user
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            console.log(`\n👑 Admin User:`);
            console.log(`   Name: ${admin.name}`);
            console.log(`   Email: ${admin.email}`);
            console.log(`   Role: ${admin.role}`);
        }
        
        console.log('\n✅ All systems ready!');
        
        await mongoose.disconnect();
        console.log('\n📴 Disconnected from database\n');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testAPI();