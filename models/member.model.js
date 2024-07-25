import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "./index.js";

const MemberModel = sequelize.define(
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
    trainer_yn: {
      type: DataTypes.TINYINT,
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
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    height: {
      type: DataTypes.NUMBER,
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
export default MemberModel;
