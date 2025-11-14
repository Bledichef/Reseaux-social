"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        unique: true, // Index unique pour permettre les clés étrangères
      },
      password: DataTypes.STRING,
      job: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          models.User.hasMany(models.Message, {
            foreignKey: "userId",
            onDelete: "cascade",
            hooks: true,
          });
          models.User.hasMany(models.Comment, {
            foreignKey: "userId",
            onDelete: "cascade",
            hooks: true,
          });
        },
      },
    }
  );
  return User;
};
