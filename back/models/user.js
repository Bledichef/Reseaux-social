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
              foreignKey: "id",
              onDelete: "cascade",
              hooks: true,
            },
          });
          models.User.hasMany(models.Comment, {
            foreignKey: {
              foreignKey: "id",
              onDelete: "cascade",
              hooks: true,
            },
          });
        },
      },
    }
  );
  return User;
};
