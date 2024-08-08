// models/Feed/Feed.model.js
import { UUIDV4 } from "sequelize";

const FeedModel = (sequelize, DataTypes) => {
  const Feed = sequelize.define(
    "FeedModel",
    {
      id: {
        type: DataTypes.CHAR,
        defaultValue: UUIDV4,
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
      sourceKey: "id",
      as: "memberFeed",
    });
    Feed.hasMany(models.LikeModel, {
      foreignKey: "feedId",
      sourceKey: "id",
      as: "feedLike",
    });
  };

  return Feed;
};

export default FeedModel;
