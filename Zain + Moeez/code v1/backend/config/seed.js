// ============================================
// FOUR WHEELS — SEED FILE
// Run: node config/seed.js
// Seeds demo users, vehicles, admin account
// ============================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const User    = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Message = require('../models/Message');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fourwheels';

const seedUsers = [
  { firstName:'Admin',   lastName:'FourWheels', email:'admin@fourwheels.pk',  phone:'03001234567', city:'Islamabad', password:'admin123',  role:'admin'  },
  { firstName:'Ahmed',   lastName:'Raza',       email:'ahmed@gmail.com',      phone:'03123456789', city:'Lahore',    password:'password123' },
  { firstName:'Sara',    lastName:'Khan',       email:'sara@gmail.com',       phone:'03339876543', city:'Karachi',   password:'password123' },
  { firstName:'Bilal',   lastName:'Ahmed',      email:'bilal@gmail.com',      phone:'03211112233', city:'Islamabad', password:'password123' },
  { firstName:'Usman',   lastName:'Ali',        email:'usman@gmail.com',      phone:'03004445566', city:'Multan',    password:'password123' },
  { firstName:'Khan',    lastName:'Sahib',      email:'khan@gmail.com',       phone:'03457778899', city:'Peshawar',  password:'password123' },
];

const getVehicleSeeds = (userIds) => [
  { title:'Toyota Corolla Altis 2022', brand:'Toyota', model:'Corolla Altis', year:2022, type:'Car',   fuel:'Petrol', transmission:'Automatic', engine:'1800cc', mileage:28000, color:'Pearl White',   condition:'Used', price:6800000, city:'Lahore',    seller:userIds[1], status:'active',  description:'Well maintained Toyota Corolla. Single owner. Recently serviced.' },
  { title:'Honda Civic Oriel 2021',    brand:'Honda',  model:'Civic Oriel',   year:2021, type:'Car',   fuel:'Petrol', transmission:'CVT',       engine:'1500cc Turbo', mileage:35000, color:'Lunar Silver', condition:'Used', price:7200000, city:'Karachi',   seller:userIds[2], status:'active',  description:'Honda Civic 1.5 Turbo. Immaculate condition. No accidents.' },
  { title:'Suzuki Cultus 2023',        brand:'Suzuki', model:'Cultus',        year:2023, type:'Car',   fuel:'Petrol', transmission:'Manual',    engine:'1000cc', mileage:12000, color:'Graphite Grey', condition:'Used', price:3100000, city:'Islamabad', seller:userIds[3], status:'active',  description:'Suzuki Cultus AGS. Low mileage, excellent fuel economy.' },
  { title:'Yamaha YBR 125 2023',       brand:'Yamaha', model:'YBR 125',       year:2023, type:'Bike',  fuel:'Petrol', transmission:'Manual',    engine:'125cc',  mileage:8500,  color:'Blue/Black',   condition:'Used', price:380000,  city:'Multan',    seller:userIds[4], status:'active',  description:'Yamaha YBR 125G. Good condition. Regular oil changes done.' },
  { title:'Toyota Hilux Revo 2020',    brand:'Toyota', model:'Hilux Revo',    year:2020, type:'Truck', fuel:'Diesel', transmission:'Manual',    engine:'2800cc', mileage:55000, color:'White',         condition:'Used', price:11500000,city:'Peshawar',  seller:userIds[5], status:'active',  description:'Toyota Hilux Revo 4x4. Powerful diesel. All genuine parts.' },
  { title:'KIA Sportage AWD 2022',     brand:'KIA',    model:'Sportage',      year:2022, type:'SUV',   fuel:'Petrol', transmission:'Automatic', engine:'2000cc', mileage:22000, color:'Snow White',    condition:'Used', price:9800000, city:'Lahore',    seller:userIds[1], status:'active',  description:'KIA Sportage Alpha AWD. Loaded with features. Single owner.' },
  { title:'Suzuki Alto VXR 2024',      brand:'Suzuki', model:'Alto',          year:2024, type:'Car',   fuel:'Petrol', transmission:'Manual',    engine:'1000cc', mileage:5000,  color:'Solid White',   condition:'New',  price:2650000, city:'Multan',    seller:userIds[4], status:'pending', description:'Brand new Suzuki Alto VXR. Full genuine warranty.' },
  { title:'KIA Picanto 2023',          brand:'KIA',    model:'Picanto',       year:2023, type:'Car',   fuel:'Petrol', transmission:'Automatic', engine:'1000cc', mileage:14000, color:'Sporty Red',    condition:'Used', price:4100000, city:'Lahore',    seller:userIds[2], status:'pending', description:'KIA Picanto automatic. Smooth drive. Karachi registered.' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(seedUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create vehicles
    const userIds = createdUsers.map(u => u._id);
    const vehicleSeeds = getVehicleSeeds(userIds);
    const createdVehicles = await Vehicle.insertMany(vehicleSeeds);
    console.log(`🚗 Created ${createdVehicles.length} vehicles`);

    // Create sample messages
    const messages = [
      { sender:userIds[2], receiver:userIds[1], vehicle:createdVehicles[0]._id, text:'Is this vehicle still available?' },
      { sender:userIds[1], receiver:userIds[2], vehicle:createdVehicles[0]._id, text:'Yes, it is! Would you like to schedule a test drive?' },
      { sender:userIds[3], receiver:userIds[2], vehicle:createdVehicles[1]._id, text:'What is your final price?' },
    ];
    await Message.insertMany(messages);
    console.log(`💬 Created ${messages.length} sample messages`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:');
    console.log('  Email:    admin@fourwheels.pk');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
