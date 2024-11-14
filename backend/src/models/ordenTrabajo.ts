import { Model, DataTypes } from "sequelize";
import sequelize from "../db/connection"; // importa tu instancia de Sequelize

export class OrdenTrabajo extends Model {
  public nroOrdenTrabajo!: number;
  public fecha!: Date;
  public costototal!: number;
  public LoteId!: number;
  public tipo!: "cosecha" | "siembra" | "fumigacion";
}

OrdenTrabajo.init(
  {
    nroOrdenTrabajo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    costototal: {
      type: DataTypes.FLOAT,
    },
    loteId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Lotes",
        key: "loteId",
      },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "usuarioId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tipo: {
      type: DataTypes.ENUM("cosecha", "siembra", "fumigacion"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrdenTrabajo",
    tableName: "OrdenesTrabajo",
  }
);
