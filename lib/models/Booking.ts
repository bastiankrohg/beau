import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for Booking model attributes
interface BookingAttributes {
  booking_id: string;
  user_id: string;
  service_id: string;
  provider_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  appointment_time: Date;
  location?: string;
  created_at: Date;
  updated_at: Date;
}

// Optional fields for creating a Booking
interface BookingCreationAttributes extends Optional<BookingAttributes, 'booking_id' | 'status' | 'location' | 'created_at' | 'updated_at'> {}

// Define the Booking model
export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public booking_id!: string;
  public user_id!: string;
  public service_id!: string;
  public provider_id!: string;
  public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  public appointment_time!: Date;
  public location?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    this.belongsTo(models.ServiceProvider, { foreignKey: 'provider_id', as: 'provider' });
    this.hasOne(models.Payment, { foreignKey: 'booking_id', as: 'payment' });
  }
}

// Initialize the model
export const initBookingModel = (sequelize: Sequelize): void => {
  Booking.init(
    {
      booking_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      provider_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings',
      timestamps: false,
    }
  );
};
