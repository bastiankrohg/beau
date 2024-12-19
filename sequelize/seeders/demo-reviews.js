'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Reviews', [
        {
          review_id: '123e4567-e89b-12d3-a456-426614174050',
          user_id: '123e4567-e89b-12d3-a456-426614174000',  // Reference to the Users table
          provider_id: '123e4567-e89b-12d3-a456-426614174010',  // Reference to the ServiceProvider table
          rating: 4.5,
          comment: 'Great haircut and excellent service!',
          created_at: new Date(),
        },
        {
          review_id: '123e4567-e89b-12d3-a456-426614174051',
          user_id: '123e4567-e89b-12d3-a456-426614174001',  // Reference to the Users table
          provider_id: '123e4567-e89b-12d3-a456-426614174011',  // Reference to the ServiceProvider table
          rating: 5.0,
          comment: 'The best manicure I have ever had!',
          created_at: new Date(),
        },
      ], {});
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Reviews', null, {});
    }
  };
  