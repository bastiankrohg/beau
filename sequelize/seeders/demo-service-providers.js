'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ServiceProviders', [
      {
        provider_id: '123e4567-e89b-12d3-a456-426614174010',
        user_id: '123e4567-e89b-12d3-a456-426614174000',  // Reference to the user table (use the correct UUID from Users)
        certification: true,
        bio: 'Expert in haircuts and beard styling.',
        rating: 4.5,
        location: 'Toulouse, France',
        profile_picture: 'https://example.com/profile1.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: '123e4567-e89b-12d3-a456-426614174011',
        user_id: '123e4567-e89b-12d3-a456-426614174001',  // Reference to the user table (use the correct UUID from Users)
        certification: true,
        bio: 'Specialist in manicures and pedicures.',
        rating: 4.7,
        location: 'Toulouse, France',
        profile_picture: 'https://example.com/profile2.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ServiceProviders', null, {});
  }
};
