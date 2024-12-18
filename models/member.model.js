import { UUIDV4 } from "sequelize";

const MemberModel = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "MemberModel",
    {
      id: {
        type: DataTypes.CHAR,
        defaultValue: UUIDV4(),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trainerYn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      goal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      allergy: {
        type: DataTypes.STRING,
      },
      naver_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workOut: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalCalories: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MemberModel",
      tableName: "Member",
      timestamp: true,
    }
  );

  Member.associate = (models) => {
    Member.hasMany(models.FeedModel, {
      foreignKey: "memberId",
      sourceKey: "id",
      as: "memberFeed",
    });
    Member.hasMany(models.CommentModel, {
      foreignKey: "memberId",
      sourceKey: "id",
      as: "memberComment",
    });
  };
  return Member;
};

export default MemberModel;
