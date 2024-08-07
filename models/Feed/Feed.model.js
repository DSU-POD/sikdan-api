// models/Feed/Feed.model.js
import { DataTypes, UUIDV4 } from "sequelize";

const FeedModel = (sequelize, DataTypes) => {
  const Feed = sequelize.define(
    "FeedModel",
    {
      id: {
        type: DataTypes.CHAR,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      // 기타 필드
    },
    {
      sequelize,
      modelName: "FeedModel",
      tableName: "Feed",
      timestamps: true,
    }
  );

  Feed.associate = (models) => {
    Feed.belongsTo(models.MemberModel, {
      foreignKey: "memberId",
      as: "memberFeed",
    });
    Feed.hasMany(models.LikeModel, {
      foreignKey: "feedId",
      as: "feedLike",
    });
  };

  return Feed;
};

export default FeedModel;
