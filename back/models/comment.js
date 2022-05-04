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

      content: DataTypes.STRING,
    },
    {}
  );
  Comment.associate = function (models) {
    // associations can be defined here

    models.Comment.belongsTo(models.Message, {
      onDelete: "CASCADE",
    });

    models.Comment.belongsTo(models.User, {
      onDelete: "CASCADE",
    });
  };
  return Comment;
};
