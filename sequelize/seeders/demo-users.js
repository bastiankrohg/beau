'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: 'hashedpassword123', // Make sure to hash the password
        phone_number: '123-456-7890',
        address: '123 Main Street',
        role: 'customer',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        password_hash: 'hashedpassword456', // Make sure to hash the password
        phone_number: '987-654-3210',
        address: '456 Elm Street',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
