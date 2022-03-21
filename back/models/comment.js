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

    models.Like.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return Comment;
};
