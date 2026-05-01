const bcrypt = require("bcrypt");
const serverAddress = `${process.env.URL}:${process.env.PORT}`;
let staticPath = `/uploads/users/`;
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING,
        field: "last_name",
      },
      role: {
        type: DataTypes.STRING,  // ADMIN or USER 

      },
      password: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        field: "phone_number"
      },

      profilePictureFile: {
        type: DataTypes.STRING,
        field: "profile_picture_file"
      },
      thumbnail: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${serverAddress}${staticPath}thumbnail/${this.profilePictureFile} `
        }
      },
      profilePicture: {
        type: DataTypes.VIRTUAL,
        get() {

          return `${serverAddress}${staticPath}${this.profilePictureFile} `
        }
      },
      status: {
        type: DataTypes.INTEGER, // 0 fort inactive and 1 for active
        allowNull: false,
        defaultValue: 1
      }
    },
    {
      tableName: "users",
      paranoid: true,
      indexes: [
      ],
      hooks: {
        beforeCreate: (user, options) => {

          const hashedPassword = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(10)
          );
          user.password = hashedPassword;
        },
      },
      classMethods: {
      },
    }
  );
  User.associate = function (models) {
   
  };
  return User;
};
