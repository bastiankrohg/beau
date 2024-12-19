import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable('Payments', {
      payment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'booking_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2), // Supports amounts up to 99999999.99
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM('card', 'paypal', 'bank_transfer', 'other'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Payments');
  },
};
