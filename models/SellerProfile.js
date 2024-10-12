const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User'); // Import the User model if not already imported

const SellerProfile = sequelize.define('SellerProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  founder: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  personalnote: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust as needed
  },
  companydetails: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust as needed
  },
  websiteurl: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust as needed
  },
  founded: {
    type: DataTypes.STRING, // Assuming founded is a string, adjust data type as needed
    allowNull: true, // Adjust as needed
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'SellerProfile', // Specify your custom table name here
});

SellerProfile.belongsTo(User);

module.exports = SellerProfile;
