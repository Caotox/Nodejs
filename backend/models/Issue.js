const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Issue = sequelize.define('Issue', {




  //Modif Titouan
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  voters: {
    type: DataTypes.JSON, // Stocke les IDs des utilisateurs ayant voté
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('open', 'resolved'),
    defaultValue: 'open'
  },







  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Au lieu de stocker un objet "location" (GeoJSON), 
  // on va simplement stocker latitude / longitude dans deux colonnes.
  latitude: {
    type: DataTypes.DECIMAL(10, 7), // ajuster en fonction de la précision souhaitée
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'resolved'),
    defaultValue: 'open'
  },
  createdBy: {
    type: DataTypes.INTEGER, // ou DataTypes.STRING si tu veux stocker un userId unique
    allowNull: false
  }
}, {
  tableName: 'issues',
  timestamps: true, // createdAt, updatedAt
});

module.exports = Issue;
