import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../index.js";

const LikeModel = sequelize.define(
  "LikeModel",
  {
    id: {
      type: DataTypes.CHAR,
      defaultValue: UUIDV4(),
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    feedId: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "LikeModel",
    tableName: "Like",
    timestamp: true,
  }
);

LikeModel.associate = ({ MemberModel }) => {
  LikeModel.hasOne(MemberModel, {
    foreignKey: "memberId",
  });
  LikeModel.hasOne(MemberModel, {
    foreignKey: "memberId",
  });
};

export default LikeModel;
