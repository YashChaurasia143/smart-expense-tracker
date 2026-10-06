const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Load environment variables
dotenv.config({ path: __dirname + '/../.env' });

const seedDB = async (clearExisting = true) => {
  try {
    if (!clearExisting) {
      const existingUserCount = await User.countDocuments();
      if (existingUserCount > 0) {
        return;
      }
      console.log('🌱 No users found, seeding default demo dataset...');
    } else {
      // Clear existing collections
      await User.deleteMany();
      await Expense.deleteMany();
      console.log('🗑️  Cleared existing Users and Expenses');
    }

    // Create Demo User
    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'demo@example.com',
      password: 'password123',
      currency: '₹'
    });

    console.log(`👤 Created Demo User: ${demoUser.email} / password123`);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    // Sample expense entries across categories and recent months
    const sampleExpenses = [
      // Today's expenses
      {
        user: demoUser._id,
        title: 'Starbucks Morning Coffee & Pastry',
        amount: 8.75,
        category: 'Food',
        description: 'Iced caramel macchiato and croissant with team',
        date: new Date(currentYear, currentMonth, currentDate, 9, 30),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Uber ride to City Office',
        amount: 24.50,
        category: 'Travel',
        description: 'Morning commute during rush hour',
        date: new Date(currentYear, currentMonth, currentDate, 10, 15),
        paymentMethod: 'UPI / Online'
      },
      {
        user: demoUser._id,
        title: 'Team Lunch at Chipotle',
        amount: 19.80,
        category: 'Food',
        description: 'Burrito bowl with guacamole',
        date: new Date(currentYear, currentMonth, currentDate, 13, 0),
        paymentMethod: 'Debit Card'
      },

      // Current month expenses
      {
        user: demoUser._id,
        title: 'Monthly High-Speed Fiber Internet',
        amount: 65.00,
        category: 'Bills',
        description: '500Mbps home fiber connection bill',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 2), 14, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Whole Foods Grocery Haul',
        amount: 142.60,
        category: 'Food',
        description: 'Organic vegetables, fruits, almond milk, and pantry essentials',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 4), 17, 30),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Nike Air Zoom Running Shoes',
        amount: 129.99,
        category: 'Shopping',
        description: 'Summer sale sportswear purchase',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 5), 18, 20),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Full Body Health Checkup & Lab Tests',
        amount: 180.00,
        category: 'Health',
        description: 'Annual wellness checkup and blood tests',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 7), 11, 0),
        paymentMethod: 'Debit Card'
      },
      {
        user: demoUser._id,
        title: 'AWS Certified Solutions Architect Course',
        amount: 34.99,
        category: 'Education',
        description: 'Udemy video course and practice exam bundle',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 9), 20, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Home Electricity & Water Utility Bill',
        amount: 115.40,
        category: 'Bills',
        description: 'Air conditioning heavy summer usage',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 11), 10, 0),
        paymentMethod: 'Bank Transfer'
      },
      {
        user: demoUser._id,
        title: 'Weekend Fuel Fill-up',
        amount: 52.00,
        category: 'Travel',
        description: 'Premium gas refill for highway trip',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 12), 16, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Books on System Design & Architecture',
        amount: 58.50,
        category: 'Education',
        description: 'Designing Data-Intensive Applications paperback',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 14), 19, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Netflix & Spotify Family Subscription',
        amount: 27.98,
        category: 'Bills',
        description: 'Monthly streaming service renewal',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 16), 8, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Amazon Household Essentials',
        amount: 78.20,
        category: 'Shopping',
        description: 'Detergent, paper towels, and desk organizer',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 18), 15, 0),
        paymentMethod: 'UPI / Online'
      },
      {
        user: demoUser._id,
        title: 'Dental Cleaning & Dental Floss',
        amount: 95.00,
        category: 'Health',
        description: 'Routine bi-annual dental prophylaxis',
        date: new Date(currentYear, currentMonth, Math.max(1, currentDate - 20), 12, 0),
        paymentMethod: 'Debit Card'
      },

      // Last month expenses (for trend comparison)
      {
        user: demoUser._id,
        title: 'Roundtrip Flight Tickets for Conference',
        amount: 320.00,
        category: 'Travel',
        description: 'Tech summit in San Francisco',
        date: new Date(currentYear, currentMonth - 1, 12, 14, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Hotel Stay (3 Nights)',
        amount: 450.00,
        category: 'Travel',
        description: 'Downtown conference hotel booking',
        date: new Date(currentYear, currentMonth - 1, 14, 12, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Supermarket Grocery Restock',
        amount: 210.30,
        category: 'Food',
        description: 'Monthly bulk pantry and refrigerated goods',
        date: new Date(currentYear, currentMonth - 1, 5, 17, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Prescription Eyeglasses & Frame',
        amount: 175.00,
        category: 'Health',
        description: 'Anti-glare computer glasses',
        date: new Date(currentYear, currentMonth - 1, 20, 16, 0),
        paymentMethod: 'Debit Card'
      },
      {
        user: demoUser._id,
        title: 'Wireless Mechanical Keyboard & Mouse',
        amount: 145.00,
        category: 'Shopping',
        description: 'Ergonomic workspace upgrade',
        date: new Date(currentYear, currentMonth - 1, 24, 18, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Electricity & Gas Utility Bill',
        amount: 108.00,
        category: 'Bills',
        description: 'Monthly utility settlement',
        date: new Date(currentYear, currentMonth - 1, 10, 10, 0),
        paymentMethod: 'Bank Transfer'
      },

      // 2 Months ago
      {
        user: demoUser._id,
        title: 'O\'Reilly Technical Learning Subscription',
        amount: 49.00,
        category: 'Education',
        description: 'Monthly platform membership',
        date: new Date(currentYear, currentMonth - 2, 8, 9, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Weekly Dinner Out with Friends',
        amount: 135.00,
        category: 'Food',
        description: 'Italian restaurant dinner and dessert',
        date: new Date(currentYear, currentMonth - 2, 18, 20, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Car Service & Oil Change',
        amount: 160.00,
        category: 'Other',
        description: 'Periodic vehicle maintenance inspection',
        date: new Date(currentYear, currentMonth - 2, 22, 11, 0),
        paymentMethod: 'Debit Card'
      },

      // 3 Months ago
      {
        user: demoUser._id,
        title: 'Noise Cancelling Headphones',
        amount: 279.00,
        category: 'Shopping',
        description: 'Sony WH-1000XM4 for focused coding',
        date: new Date(currentYear, currentMonth - 3, 15, 14, 0),
        paymentMethod: 'Credit Card'
      },
      {
        user: demoUser._id,
        title: 'Apartment Maintenance & Utilities',
        amount: 130.00,
        category: 'Bills',
        description: 'Society maintenance and water charges',
        date: new Date(currentYear, currentMonth - 3, 3, 10, 0),
        paymentMethod: 'Bank Transfer'
      }
    ];

    await Expense.insertMany(sampleExpenses);
    console.log(`💰 Successfully seeded ${sampleExpenses.length} categorized expenses!`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Demo Login Credentials:');
    console.log('Email:    demo@example.com');
    console.log('Password: password123');
    console.log('--------------------------------------------------\n');
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  const runStandalone = async () => {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
      await mongoose.connect(mongoUri);
      console.log('🌱 Connected to MongoDB for seeding...');
      await seedDB(true);
      process.exit(0);
    } catch (err) {
      console.error('❌ Seeding Error:', err.message);
      process.exit(1);
    }
  };
  runStandalone();
}

module.exports = { seedDB };
