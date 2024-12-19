import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable('Reviews', {
      review_id: {
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
      rating: {
        type: DataTypes.DECIMAL(2, 1), // Supports ratings from 0.0 to 9.9
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Reviews');
  },
};
