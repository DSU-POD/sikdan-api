import { UUIDV4 } from "sequelize";

const ReportModel = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "ReportModel",
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
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ReportModel",
      tableName: "Report",
      timestamp: true,
    }
  );

  Report.associate = ({ MemberModel, FeedModel }) => {
    Report.belongsTo(MemberModel, {
      foreignKey: "memberId",
      as: "memberReport",
    });
    Report.belongsTo(FeedModel, {
      foreignKey: "feedId",
      sourceKey: "id",
      as: "feedReport",
    });
  };

  return Report;
};

export default ReportModel;
