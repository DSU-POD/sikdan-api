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
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ai_feedback: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      likeNum: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      commentNum: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "expert",
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
    Feed.belongsTo(models.DietModel, {
      foreignKey: "dietId",
      sourceKey: "id",
      as: "feedDiet",
    });
    Feed.hasMany(models.CommentModel, {
      foreignKey: "feedId",
      sourceKey: "id",
      as: "feedComment",
    });
  };

  return Feed;
};

export default FeedModel;
