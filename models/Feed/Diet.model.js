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
      postId: {
        type: DataTypes.CHAR,
        defaultValue: UUIDV4(),
        allowNull: false,
      },
      memberId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      predictData: {
        type: DataTypes.TEXT,
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