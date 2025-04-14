//Modif Titouan

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vote = sequelize.define('Vote', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['UserId', 'IssueId']
      }
    ]
  });

  return Vote;
};