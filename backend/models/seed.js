const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // Drop and recreate tables

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Database seeded with admin user.');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

seed();
