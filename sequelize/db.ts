import { Sequelize } from 'sequelize';
import { initUserModel } from './models/User';
import { initServiceProviderModel } from './models/ServiceProvider';
import { initServiceModel } from './models/Service';
import { initBookingModel } from './models/Booking';
import { initPaymentModel } from './models/Payment';
import { initReviewModel } from './models/Review';
import { initNotificationModel } from './models/Notification';
import { initAdminLogModel } from './models/AdminLog';

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

const models: any = {};

// Initialize models
initUserModel(sequelize);
initServiceProviderModel(sequelize);
initServiceModel(sequelize);
initBookingModel(sequelize);
initPaymentModel(sequelize);
initReviewModel(sequelize);
initNotificationModel(sequelize);
initAdminLogModel(sequelize);

// Populate the `models` object with initialized models
models.User = sequelize.models.User;
models.ServiceProvider = sequelize.models.ServiceProvider;
models.Service = sequelize.models.Service;
models.Booking = sequelize.models.Booking;
models.Payment = sequelize.models.Payment;
models.Review = sequelize.models.Review;
models.Notification = sequelize.models.Notification;
models.AdminLog = sequelize.models.AdminLog;

// Invoke associations
Object.values(models).forEach((model: any) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export default sequelize;
