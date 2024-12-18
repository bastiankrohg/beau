import sequelize from '../db';
import { initUserModel } from './User';
import { initServiceProviderModel } from './ServiceProvider';
import { initServiceModel } from './Service';
import { initBookingModel } from './Booking';
import { initPaymentModel } from './Payment';
import { initReviewModel } from './Review';
import { initNotificationModel } from './Notification';
import { initAdminLogModel } from './AdminLog';

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

export { sequelize };
export default models;
