import { UUIDV4 } from "sequelize";
const DietModel = (sequelize, DataTypes) => {
  const Diet = sequelize.define(
    "DietModel",
    {
      id: {
        type: DataTypes.CHAR,
        defaultValue: UUIDV4(),
        primaryKey: true,
      },
      feedId: {
        type: DataTypes.CHAR,
        defaultValue: UUIDV4(),
        allowNull: false,
      },
      dietName: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      foods: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nutrient: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      foods: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      total_calories: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DietModel",
      tableName: "Diet",
      timestamp: true,
    }
  );

  return Diet;
};
export default DietModel;
