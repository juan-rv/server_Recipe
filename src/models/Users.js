const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "users",
        {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("guest", "admin"),
        allowNull: false,
      },
      baned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
    )
}