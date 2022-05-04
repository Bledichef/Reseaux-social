"use strict";

module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define(
    "Message",

    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
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
            onDelete: "CASCADE",
          });
          models.Message.belongsTo(models.Comment, {
            foreignKey: {
              allowNull: true,
            },
            onDelete: "CASCADE",
          });
        },
      },
    }
  );
  return Message;
};
