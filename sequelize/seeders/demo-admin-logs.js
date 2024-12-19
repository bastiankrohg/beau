'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AdminLogs', [
      {
        log_id: '123e4567-e89b-12d3-a456-426614174080', 
        admin_id: '123e4567-e89b-12d3-a456-426614174001', 
        action: 'Approved a new service provider.',
        timestamp: new Date('2024-12-01T10:00:00Z'),
      },
      {
        log_id: '123e4567-e89b-12d3-a456-426614174081', 
        admin_id: '123e4567-e89b-12d3-a456-426614174001', 
        action: 'Deleted a booking for user John Doe.',
        timestamp: new Date('2024-12-02T14:30:00Z'),
      },
      {
        log_id: '123e4567-e89b-12d3-a456-426614174082', 
        admin_id: '123e4567-e89b-12d3-a456-426614174001', 
        action: 'Updated payment status for booking ID 12345.',
        timestamp: new Date('2024-12-03T16:00:00Z'),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AdminLogs', null, {});
  }
};
