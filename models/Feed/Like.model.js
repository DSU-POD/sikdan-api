import { UUIDV4 } from "sequelize";

const LikeModel = (sequelize, DataTypes) => {
  const Like = sequelize.define(
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

  Like.associate = ({ MemberModel, FeedModel }) => {
    Like.belongsTo(MemberModel, {
      foreignKey: "memberId",
      as: "memberLike",
    });
    Like.belongsTo(FeedModel, {
      foreignKey: "feedId",
      sourceKey: "id",
      as: "feedLike",
    });
  };

  return Like;
};

export default LikeModel;
