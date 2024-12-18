import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for Notification model attributes
interface NotificationAttributes {
  notification_id: string;
  user_id: string;
  message: string;
  status: 'read' | 'unread';
  created_at: Date;
}

// Optional fields for creating a Notification
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'notification_id' | 'status' | 'created_at'> {}

// Define the Notification model
export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public notification_id!: string;
  public user_id!: string;
  public message!: string;
  public status!: 'read' | 'unread';
  public created_at!: Date;

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

// Initialize the model
export const initNotificationModel = (sequelize: Sequelize): void => {
  Notification.init(
    {
      notification_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('read', 'unread'),
        allowNull: false,
        defaultValue: 'unread',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications',
      timestamps: false,
    }
  );
};
