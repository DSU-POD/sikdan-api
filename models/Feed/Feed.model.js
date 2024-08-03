import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../index.js";

const FeedModel = sequelize.define(
  "FeedModel",
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
    dietId: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contents: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ai_feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likeNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FeedModel",
    tableName: "Feed",
    timestamp: true,
  }
);

FeedModel.associate = ({ MemberModel, LikeModel, DietModel }) => {
  FeedModel.hasOne(MemberModel, {
    foreignKey: "memberId",
  });
  FeedModel.hasMany(LikeModel, {
    foreignKey: "feedId",
  });
  FeedModel.hasMany(DietModel, {
    foreignKey: "feedId",
  });
};

export default FeedModel;
