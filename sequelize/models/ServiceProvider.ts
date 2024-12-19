import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for ServiceProvider model attributes
interface ServiceProviderAttributes {
  provider_id: string;
  user_id: string;
  certification: boolean;
  bio?: string;
  rating: number;
  location?: string;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
}

// Optional fields for creating a ServiceProvider
interface ServiceProviderCreationAttributes extends Optional<ServiceProviderAttributes, 'provider_id' | 'certification' | 'bio' | 'rating' | 'location' | 'profile_picture' | 'created_at' | 'updated_at'> {}

// Define the ServiceProvider model
export class ServiceProvider extends Model<ServiceProviderAttributes, ServiceProviderCreationAttributes> implements ServiceProviderAttributes {
  public provider_id!: string;
  public user_id!: string;
  public certification!: boolean;
  public bio?: string;
  public rating!: number;
  public location?: string;
  public profile_picture?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.Service, { foreignKey: 'provider_id', as: 'services' });
    this.hasMany(models.Booking, { foreignKey: 'provider_id', as: 'bookings' });
    this.hasMany(models.Review, { foreignKey: 'provider_id', as: 'reviews' });
  }
}

// Initialize the model
export const initServiceProviderModel = (sequelize: Sequelize): void => {
  ServiceProvider.init(
    {
      provider_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      certification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_picture: {
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
      modelName: 'ServiceProvider',
      tableName: 'ServiceProviders',
      timestamps: false,
    }
  );
};
