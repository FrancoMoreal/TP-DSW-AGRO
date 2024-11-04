import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection';

export interface LoteAttributes {
  loteId?: number;
  campoId: number;
  loteNro: number;
  loteHectareas: number;
}

export class Lote extends Model<LoteAttributes> implements LoteAttributes {
  public loteId?: number;
  public campoId!: number;
  public loteNro!: number;
  public loteHectareas!: number;

  static initModel(sequelize: Sequelize) {
    Lote.init(
      {
        loteId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        campoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Campos', 
            key: 'campoId',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        loteNro: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        loteHectareas: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Lote',
        tableName: 'Lotes',
      }
    );
  }
}

Lote.initModel(sequelize);
