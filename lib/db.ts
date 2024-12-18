import { Sequelize } from 'sequelize';

const isTestEnv = process.env.NODE_ENV === 'test';

// Database configuration
const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT as 'sqlite' | 'postgres',
  storage: isTestEnv ? process.env.DATABASE_TEST_STORAGE : process.env.DATABASE_STORAGE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : undefined,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Enable logging only in development
});

export default sequelize;
