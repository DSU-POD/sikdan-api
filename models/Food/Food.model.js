import { UUIDV4 } from "sequelize";

const FoodListModel = (sequelize, DataTypes) => {
  const FoodList = sequelize.define(
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
  return FoodList;
};
export default FoodListModel;
