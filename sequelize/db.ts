import { Sequelize } from 'sequelize';

// Database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_STORAGE,
  // host: process.env.DATABASE_HOST,
  // port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : undefined,
  // database: process.env.DATABASE_NAME,
  // username: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Enable logging only in development
});

export default sequelize;
