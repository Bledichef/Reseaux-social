"use strict";
"use strict";
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define(
    "Comment",
    {
      content: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          models.Comment.hasMany(models.Message);
          models.Comment.belongsTo(models.User, {
            foreignKey: {
              allowNull: false,
            },
          });
        },
      },
    }
  );
  return Comment;
};
