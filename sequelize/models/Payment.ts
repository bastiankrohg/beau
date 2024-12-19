import { Model, DataTypes, Sequelize, Optional, Association} from 'sequelize';
import { Booking } from './Booking';

// Interface for Payment model attributes
interface PaymentAttributes {
  payment_id: string;
  booking_id: string;
  amount: number;
  payment_method: 'card' | 'paypal' | 'bank_transfer' | 'other';
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
  updated_at: Date;
}

// Optional fields for creating a Payment
interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'payment_id' | 'status' | 'created_at' | 'updated_at'> {}

// Define the Payment model
export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public payment_id!: string;
  public booking_id!: string;
  public amount!: number;
  public payment_method!: 'card' | 'paypal' | 'bank_transfer' | 'other';
  public status!: 'pending' | 'completed' | 'failed';
  public created_at!: Date;
  public updated_at!: Date;

  public booking?: Booking; // Add this line
  public static associations: {
    booking: Association<Payment, Booking>;
  };

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  }
}

// Initialize the model
export const initPaymentModel = (sequelize: Sequelize): void => {
  Payment.init(
    {
      payment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
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
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'Payments',
      timestamps: false,
    }
  );
};
