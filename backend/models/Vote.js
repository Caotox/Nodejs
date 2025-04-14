
// ------------------------ Titouan --------------------------

// backend/models/Vote.js
module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    });

    Vote.associate = models => {
        Vote.belongsTo(models.User);
        Vote.belongsTo(models.Issue);
    };

    return Vote;
};

// -----------------------------------