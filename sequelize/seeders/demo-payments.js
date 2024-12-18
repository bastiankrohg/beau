'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Payments', [
        {
          payment_id: '123e4567-e89b-12d3-a456-426614174060',
          booking_id: '123e4567-e89b-12d3-a456-426614174030',  // Reference to the Bookings table
          amount: 20.00,
          payment_method: 'card',
          status: 'completed',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          payment_id: '123e4567-e89b-12d3-a456-426614174061',
          booking_id: '123e4567-e89b-12d3-a456-426614174031',  // Reference to the Bookings table
          amount: 25.00,
          payment_method: 'paypal',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], {});
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Payments', null, {});
    }
  };
  