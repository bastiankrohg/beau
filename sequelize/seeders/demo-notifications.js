'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Notifications', [
        {
          notification_id: '123e4567-e89b-12d3-a456-426614174070',
          user_id: '123e4567-e89b-12d3-a456-426614174000',  // Reference to the Users table
          message: 'Your booking for a haircut has been confirmed.',
          status: 'unread',
          created_at: new Date(),
        },
        {
          notification_id: '123e4567-e89b-12d3-a456-426614174071',
          user_id: '123e4567-e89b-12d3-a456-426614174001',  // Reference to the Users table
          message: 'Your payment for the manicure is pending.',
          status: 'unread',
          created_at: new Date(),
        },
        {
          notification_id: '123e4567-e89b-12d3-a456-426614174072',
          user_id: '123e4567-e89b-12d3-a456-426614174000',  // Reference to the Users table
          message: 'Your provider has canceled your booking. Please reschedule.',
          status: 'unread',
          created_at: new Date(),
        },
      ], {});
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Notifications', null, {});
    }
  };
  