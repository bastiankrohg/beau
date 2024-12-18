import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Interface for AdminLog model attributes
interface AdminLogAttributes {
  log_id: string;
  admin_id: string;
  action: string;
  timestamp: Date;
}

// Optional fields for creating an AdminLog
interface AdminLogCreationAttributes extends Optional<AdminLogAttributes, 'log_id' | 'timestamp'> {}

// Define the AdminLog model
export class AdminLog extends Model<AdminLogAttributes, AdminLogCreationAttributes> implements AdminLogAttributes {
  public log_id!: string;
  public admin_id!: string;
  public action!: string;
  public timestamp!: Date;

  // Associations
  public static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: 'admin_id', as: 'admin' });
  }
}

// Initialize the model
export const initAdminLogModel = (sequelize: Sequelize): void => {
  AdminLog.init(
    {
      log_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      admin_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      action: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'AdminLog',
      tableName: 'AdminLogs',
      timestamps: false,
    }
  );
};
