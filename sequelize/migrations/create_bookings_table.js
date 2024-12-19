import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable('Bookings', {
      booking_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'service_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      provider_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'ServiceProviders',
          key: 'provider_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      appointment_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('Bookings');
  },
};
