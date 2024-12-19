import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for Service model attributes
interface ServiceAttributes {
  service_id: string;
  name: string;
  description?: string;
  price: number;
  provider_id: string;
  created_at: Date;
  updated_at: Date;
}

// Optional fields for creating a Service
interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'service_id' | 'description' | 'created_at' | 'updated_at'> {}

// Define the Service model
export class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public service_id!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public provider_id!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.ServiceProvider, { foreignKey: 'provider_id', as: 'provider' });
    this.hasMany(models.Booking, { foreignKey: 'service_id', as: 'bookings' });
  }
}

// Initialize the model
export const initServiceModel = (sequelize: Sequelize): void => {
  Service.init(
    {
      service_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      provider_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
      modelName: 'Service',
      tableName: 'Services',
      timestamps: false,
    }
  );
};
