'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Bookings', [
      {
        booking_id: '123e4567-e89b-12d3-a456-426614174030',
        user_id: '123e4567-e89b-12d3-a456-426614174000', // Reference to John Doe in Users table
        service_id: '123e4567-e89b-12d3-a456-426614174020', // Reference to Haircut in Services table
        provider_id: '123e4567-e89b-12d3-a456-426614174010', // Reference to Provider1 in ServiceProviders table
        status: 'confirmed',
        appointment_time: new Date('2024-12-15T10:00:00Z'),
        location: 'salon',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        booking_id: '123e4567-e89b-12d3-a456-426614174031',
        user_id: '123e4567-e89b-12d3-a456-426614174001', // Reference to Jane Smith in Users table
        service_id: '123e4567-e89b-12d3-a456-426614174021', // Reference to Manicure in Services table
        provider_id: '123e4567-e89b-12d3-a456-426614174011', // Reference to Provider2 in ServiceProviders table
        status: 'pending',
        appointment_time: new Date('2024-12-16T15:00:00Z'),
        location: 'home',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', null, {});
  }
};
