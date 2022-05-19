"use strict";

module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define(
    "Message",

    {
      username: {
        type: DataTypes.STRING,
        references: {
          model: "Users",
          key: "username",
        },
      },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      attachement: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here

          models.Message.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade",
            hooks: true,
          });
          models.Message.hasMany(models.Comment, {
            foreignKey: "messageId",
            onDelete: "cascade",
            hooks: true,
          });
        },
      },
    }
  );
  return Message;
};
