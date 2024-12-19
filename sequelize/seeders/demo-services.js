'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Services', [
        {
          service_id: '123e4567-e89b-12d3-a456-426614174020',
          name: 'Haircut',
          description: 'A stylish and modern haircut.',
          price: 20.00,
          provider_id: '123e4567-e89b-12d3-a456-426614174010',  // Reference to the ServiceProvider table
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          service_id: '123e4567-e89b-12d3-a456-426614174021',
          name: 'Manicure',
          description: 'A relaxing manicure with nail polish.',
          price: 25.00,
          provider_id: '123e4567-e89b-12d3-a456-426614174011',  // Reference to the ServiceProvider table
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], {});
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Services', null, {});
    }
  };
  