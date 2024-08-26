import { UUIDV4 } from "sequelize";

const CommentModel = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "CommentModel",
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // 기타 필드
    },
    {
      sequelize,
      modelName: "CommentModel",
      tableName: "Comment",
      timestamps: true,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.MemberModel, {
      foreignKey: "memberId",
      sourceKey: "id",
      as: "memberComment",
    });
    Comment.belongsTo(models.FeedModel, {
      foreignKey: "feedId",
      sourceKey: "id",
      as: "feedComment",
    });
  };

  return Comment;
};

export default CommentModel;
