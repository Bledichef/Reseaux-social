"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      job: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          models.User.hasMany(models.Message, {
            foreignKey: {
              allowNull: false,
            },
            onDelete: "CASCADE",
          });
          models.User.hasMany(models.Comment, {
            foreignKey: {
              allowNull: false,
            },
            onDelete: "CASCADE",
          });
        },
      },
    }
  );
  return User;
};
