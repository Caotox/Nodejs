module.exports = (sequelize) => {
    const { User, Issue, Vote } = sequelize.models;
    
    User.belongsToMany(Issue, { through: Vote });
    Issue.belongsToMany(User, { through: Vote });
    Vote.belongsTo(User);
    Vote.belongsTo(Issue);
  };