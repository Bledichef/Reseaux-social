"use strict";

module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define(
    "Comment",
    {
      messageId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Message",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      content: DataTypes.STRING,
    },
    {}
  );
  Comment.associate = function (models) {
    // associations can be defined here

    models.User.belongsToMany(models.Message, {
      through: models.Like,
      foreignKey: "userId",
      otherKey: "messageId",
    });

    models.Message.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: "messageId",
      otherKey: "userId",
    });
  };
  return Comment;
};
