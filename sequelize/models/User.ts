import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for the User model attributes
interface UserAttributes {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  address?: string;
  role: 'customer' | 'provider' | 'admin';
  created_at: Date;
  updated_at: Date;
}

// Optional fields for creating a User
interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'created_at' | 'updated_at'> {}

// Define the User model
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public phone_number?: string;
  public address?: string;
  public role!: 'customer' | 'provider' | 'admin';
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public static associate(models: any): void {
    this.hasOne(models.ServiceProvider, { foreignKey: 'user_id', as: 'serviceProvider' });
    this.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
    this.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
    this.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
    this.hasMany(models.Payment, { foreignKey: 'user_id', as: 'payments' });
    this.hasMany(models.AdminLog, { foreignKey: 'admin_id', as: 'adminLogs' });
  }
}

// Initialize the model
export const initUserModel = (sequelize: Sequelize): void => {
  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('customer', 'provider', 'admin'),
        allowNull: false,
        defaultValue: 'customer',
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
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: false,
    }
  );
};
