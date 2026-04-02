const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Message = require('../models/Message');

dotenv.config();

async function resetDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Ask for confirmation (in terminal)
        console.log('\n⚠️  WARNING: This will delete ALL data from the database!');
        console.log('Type "yes" to confirm: ');
        
        // For automatic reset without confirmation (for scripts)
        const args = process.argv.slice(2);
        const confirm = args[0] === '--force' ? 'yes' : await new Promise(resolve => {
            process.stdin.once('data', data => {
                resolve(data.toString().trim().toLowerCase());
            });
        });

        if (confirm === 'yes') {
            await User.deleteMany({});
            await Vehicle.deleteMany({});
            await Message.deleteMany({});
            console.log('🗑️  Database reset successfully!');
        } else {
            console.log('❌ Reset cancelled');
        }

        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();