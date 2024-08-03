import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../index.js";
const DietModel = sequelize.define(
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

DietModel.associate = ({ MemberModel, FeedModel }) => {
  DietModel.hasOne(MemberModel, {
    foreignKey: "memberId",
  });
  DietModel.hasOne(FeedModel, {
    foreignKey: "feedId",
  });
};

export default DietModel;
