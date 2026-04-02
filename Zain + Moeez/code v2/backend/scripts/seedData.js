const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Message = require('../models/Message');

dotenv.config();

// Sample Users Data
const users = [
    {
        name: 'Admin User',
        email: 'admin@fourwheels.com',
        password: 'admin123',
        phone: '03000000000',
        city: 'Karachi',
        role: 'admin',
        isBlocked: false
    },
    {
        name: 'Ali Raza',
        email: 'ali@example.com',
        password: 'password123',
        phone: '03011234567',
        city: 'Lahore',
        role: 'seller',
        isBlocked: false
    },
    {
        name: 'Sara Khan',
        email: 'sara@example.com',
        password: 'password123',
        phone: '03017654321',
        city: 'Islamabad',
        role: 'seller',
        isBlocked: false
    },
    {
        name: 'Usman Ahmed',
        email: 'usman@example.com',
        password: 'password123',
        phone: '03019876543',
        city: 'Karachi',
        role: 'buyer',
        isBlocked: false
    },
    {
        name: 'Fatima Zafar',
        email: 'fatima@example.com',
        password: 'password123',
        phone: '03015556677',
        city: 'Multan',
        role: 'buyer',
        isBlocked: false
    },
    {
        name: 'Hamza Ali',
        email: 'hamza@example.com',
        password: 'password123',
        phone: '03018889900',
        city: 'Rawalpindi',
        role: 'seller',
        isBlocked: false
    }
];

// Sample Vehicles Data
const vehicles = [
    {
        title: 'Honda Civic 2022',
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        price: 8500000,
        city: 'Karachi',
        condition: 'New',
        vehicleType: 'Car',
        description: 'Honda Civic 2022 model in excellent condition. Features include: Sunroof, Leather seats, Navigation system, Reverse camera, Alloy wheels. First owner, full service history available. Perfect for family use.',
        images: [
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500',
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Toyota Corolla 2021',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2021,
        price: 7200000,
        city: 'Lahore',
        condition: 'Used',
        vehicleType: 'Car',
        description: 'Toyota Corolla 2021 in great condition. Well maintained, low mileage (25,000 km). Features: AC, Power steering, Power windows, Central locking, Alloy wheels. Family car, non-accidental.',
        images: [
            'https://images.unsplash.com/photo-1626668893636-6f1a5aa9b0e9?w=500',
            'https://images.unsplash.com/photo-1626668893636-6f1a5aa9b0e9?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Suzuki Mehran 2019',
        brand: 'Suzuki',
        model: 'Mehran',
        year: 2019,
        price: 1800000,
        city: 'Islamabad',
        condition: 'Used',
        vehicleType: 'Car',
        description: 'Suzuki Mehran 2019 model. Economical car, perfect for city driving. Good fuel average. AC works perfectly. First owner, well maintained.',
        images: [
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Honda CD 70 2023',
        brand: 'Honda',
        model: 'CD 70',
        year: 2023,
        price: 165000,
        city: 'Multan',
        condition: 'New',
        vehicleType: 'Bike',
        description: 'Honda CD 70 2023 model brand new. Excellent fuel average, comfortable ride. Perfect for daily commuting. Original condition with warranty.',
        images: [
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Toyota Yaris 2022',
        brand: 'Toyota',
        model: 'Yaris',
        year: 2022,
        price: 5200000,
        city: 'Karachi',
        condition: 'New',
        vehicleType: 'Car',
        description: 'Toyota Yaris 1.3 CVT 2022 model. Low mileage (15,000 km). Features: Push start, Cruise control, Reverse camera, Touch screen infotainment, Alloy wheels. Showroom condition.',
        images: [
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Suzuki Swift 2021',
        brand: 'Suzuki',
        model: 'Swift',
        year: 2021,
        price: 3800000,
        city: 'Lahore',
        condition: 'Used',
        vehicleType: 'Car',
        description: 'Suzuki Swift DLX 2021 model. Well maintained, 30,000 km driven. Features: Auto AC, Power windows, Alloy wheels, Push start, Keyless entry. Sporty look with excellent performance.',
        images: [
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500',
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Yamaha YBR 125 2022',
        brand: 'Yamaha',
        model: 'YBR 125',
        year: 2022,
        price: 375000,
        city: 'Rawalpindi',
        condition: 'New',
        vehicleType: 'Bike',
        description: 'Yamaha YBR 125 2022 model in excellent condition. Stylish design, powerful engine, good fuel average. Perfect for young riders.',
        images: [
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Kia Sportage 2023',
        brand: 'Kia',
        model: 'Sportage',
        year: 2023,
        price: 9500000,
        city: 'Islamabad',
        condition: 'New',
        vehicleType: 'SUV',
        description: 'Kia Sportage 2023 Alpha model. Brand new, 0 km driven. Full option: Sunroof, Leather seats, 360 camera, Heated seats, Ambient lighting. Ultimate luxury SUV.',
        images: [
            'https://images.unsplash.com/photo-1626668893636-6f1a5aa9b0e9?w=500',
            'https://images.unsplash.com/photo-1626668893636-6f1a5aa9b0e9?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Hyundai Elantra 2022',
        brand: 'Hyundai',
        model: 'Elantra',
        year: 2022,
        price: 6200000,
        city: 'Karachi',
        condition: 'Used',
        vehicleType: 'Car',
        description: 'Hyundai Elantra 2022 model. 20,000 km driven, excellent condition. Features: Sunroof, Leather seats, Navigation, Reverse camera, Keyless entry. Sporty sedan with great features.',
        images: [
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500',
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500'
        ],
        threeDModelUrl: null,
        status: 'pending',
        views: 0
    },
    {
        title: 'BMW 3 Series 2021',
        brand: 'BMW',
        model: '3 Series',
        year: 2021,
        price: 14500000,
        city: 'Lahore',
        condition: 'Used',
        vehicleType: 'Car',
        description: 'BMW 3 Series 330i 2021 model. Premium luxury sedan with 35,000 km driven. Features: M Sport package, Panoramic sunroof, Heated seats, Harman Kardon sound system. Excellent condition.',
        images: [
            'https://images.unsplash.com/photo-1626668893636-6f1a5aa9b0e9?w=500',
            'https://images.unsplash.com/photo-1626668893636-6f1a5aa9b0e9?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'United US 150 2023',
        brand: 'United',
        model: 'US 150',
        year: 2023,
        price: 210000,
        city: 'Faisalabad',
        condition: 'New',
        vehicleType: 'Bike',
        description: 'United US 150 2023 model. Powerful 150cc engine, sporty design, LED headlights. Great for long rides and daily commute.',
        images: [
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500'
        ],
        threeDModelUrl: null,
        status: 'approved',
        views: 0
    },
    {
        title: 'Toyota Hilux Revo 2022',
        brand: 'Toyota',
        model: 'Hilux Revo',
        year: 2022,
        price: 12500000,
        city: 'Karachi',
        condition: 'Used',
        vehicleType: 'Truck',
        description: 'Toyota Hilux Revo 2.8L 4x4 2022 model. 45,000 km driven, excellent for off-road. Features: Leather seats, Navigation, Reverse camera, Alloy wheels. Perfect for adventure enthusiasts.',
        images: [
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500',
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500'
        ],
        threeDModelUrl: null,
        status: 'pending',
        views: 0
    }
];

// Assign vehicles to sellers
vehicles[0].sellerId = null; // Will be assigned after users are created
vehicles[1].sellerId = null;
vehicles[2].sellerId = null;
vehicles[3].sellerId = null;
vehicles[4].sellerId = null;
vehicles[5].sellerId = null;
vehicles[6].sellerId = null;
vehicles[7].sellerId = null;
vehicles[8].sellerId = null;
vehicles[9].sellerId = null;
vehicles[10].sellerId = null;
vehicles[11].sellerId = null;

// Seed function
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Message.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const createdUsers = [];
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            createdUsers.push(user);
            console.log(`✅ Created user: ${user.name} (${user.email})`);
        }

        // Get seller users
        const sellers = createdUsers.filter(u => u.role === 'seller');
        
        // Assign vehicles to sellers
        const createdVehicles = [];
        for (let i = 0; i < vehicles.length; i++) {
            const vehicleData = vehicles[i];
            // Assign to seller in round-robin
            const seller = sellers[i % sellers.length];
            vehicleData.sellerId = seller._id;
            
            const vehicle = new Vehicle(vehicleData);
            await vehicle.save();
            createdVehicles.push(vehicle);
            console.log(`✅ Created vehicle: ${vehicle.title} (${vehicle.brand} ${vehicle.model}) - Seller: ${seller.name}`);
        }

        // Create sample messages
        const buyers = createdUsers.filter(u => u.role === 'buyer');
        
        if (buyers.length > 0 && createdVehicles.length > 0) {
            const sampleMessage = new Message({
                vehicleId: createdVehicles[0]._id,
                buyerId: buyers[0]._id,
                sellerId: createdVehicles[0].sellerId,
                message: 'I am interested in this vehicle. Is it still available?',
                isRead: false
            });
            await sampleMessage.save();
            console.log('✅ Created sample message');
        }

        // Display summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 DATABASE SEED SUMMARY');
        console.log('='.repeat(50));
        console.log(`👥 Users: ${createdUsers.length}`);
        console.log(`   - Admin: ${createdUsers.filter(u => u.role === 'admin').length}`);
        console.log(`   - Sellers: ${createdUsers.filter(u => u.role === 'seller').length}`);
        console.log(`   - Buyers: ${createdUsers.filter(u => u.role === 'buyer').length}`);
        console.log(`\n🚗 Vehicles: ${createdVehicles.length}`);
        console.log(`   - Approved: ${createdVehicles.filter(v => v.status === 'approved').length}`);
        console.log(`   - Pending: ${createdVehicles.filter(v => v.status === 'pending').length}`);
        console.log(`\n💬 Messages: 1`);
        console.log('\n' + '='.repeat(50));
        console.log('🔑 LOGIN CREDENTIALS');
        console.log('='.repeat(50));
        console.log('\n👑 Admin User:');
        console.log('   Email: admin@fourwheels.com');
        console.log('   Password: admin123');
        console.log('\n👤 Seller Users:');
        console.log('   1. ali@example.com / password123');
        console.log('   2. sara@example.com / password123');
        console.log('   3. hamza@example.com / password123');
        console.log('\n👥 Buyer Users:');
        console.log('   1. usman@example.com / password123');
        console.log('   2. fatima@example.com / password123');
        console.log('\n' + '='.repeat(50));
        console.log('✅ Database seeded successfully!');
        console.log('='.repeat(50));

        // Disconnect
        await mongoose.disconnect();
        console.log('\n📴 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run seed function
seedDatabase();