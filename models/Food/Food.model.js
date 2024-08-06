import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "./index.js";

const FoodListModel = sequelize.define(
  "FoodListModel",
  {
    id: {
      type: DataTypes.CHAR,
      defaultValue: UUIDV4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4(),
      allowNull: false,
    },
    kcal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    protein: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    fat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    carb: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    sugar: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    natrium: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: "FoodListModel",
    tableName: "FoodList",
    timestamp: true,
  }
);
export default FoodListModel;
