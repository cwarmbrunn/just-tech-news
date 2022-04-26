const bcrypt = require("bcrypt");
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Create our User Model
class User extends Model {
  // Set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    id: {
      // Use the special sequelize DataTypes object to provide what type of data it is
      type: DataTypes.INTEGER,
      // This is the equivalent of SQL's "NOT NULL" option
      allowNull: false,
      // Instruct this as the primary key
      primaryKey: true,
      // Turn on auto increment
      autoIncrement: true,
    },
    // Define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // There cannot be any duplicate email values in this table
      unique: true,
      // If allowNull is set to false - we can run our data through validators before creating the table data
      validate: {
        isEmail: true,
      },
    },
    // Define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // This means that the password must be at least four characters long
        len: [4],
      },
    },
  },

  {
    hooks: {
      // Set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // Set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    // TABLE CONFIGURATION OPTIONS GO HERE
    // Pass in our imported sequelize connection  (the direct connection to our database!)
    sequelize,

    // Don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // Don't pluralize the name of the database table
    freezeTableName: true,
    // Do use underscores instead of camel casing (i.e. 'comment_text' instead of 'commentText')
    underscored: true,
    // Do make model name stay in lowercase in the database
    modelName: "user",
  }
);

module.exports = User;
