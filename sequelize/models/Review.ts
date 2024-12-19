import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for Review model attributes
interface ReviewAttributes {
  review_id: string;
  user_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
}

// Optional fields for creating a Review
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'review_id' | 'comment' | 'created_at'> {}

// Define the Review model
export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public review_id!: string;
  public user_id!: string;
  public provider_id!: string;
  public rating!: number;
  public comment?: string;
  public created_at!: Date;

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.ServiceProvider, { foreignKey: 'provider_id', as: 'provider' });
  }
}

// Initialize the model
export const initReviewModel = (sequelize: Sequelize): void => {
  Review.init(
    {
      review_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      provider_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
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
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'Reviews',
      timestamps: false,
    }
  );
};
