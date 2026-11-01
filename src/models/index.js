// ONE Sequelize instance (one connection pool) for the whole API.
// Every other file imports it from here - nobody opens a second one.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Week 11: load your models here, one line each, then add their associations.
// Example:
const User = require('./user')(sequelize, DataTypes);
//   const Player = require('./player')(sequelize, DataTypes);
//   User.hasMany(Player, { foreignKey: 'user_id' });
//   Player.belongsTo(User, { foreignKey: 'user_id' });
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const GameSession = require('./game_session')(sequelize, DataTypes);
const Players = require('./players')(sequelize, DataTypes);

// 2. Define Associations (ERD Relationships)
User.hasMany(QuestionSet, { foreignKey: 'host_id' });
QuestionSet.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

User.hasMany(GameSession, { foreignKey: 'host_id' });
GameSession.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

QuestionSet.hasMany(GameSession, { foreignKey: 'question_set_id' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'question_set_id' });

GameSession.hasMany(Players, { foreignKey: 'game_session_id' });
Players.belongsTo(GameSession, { foreignKey: 'game_session_id' });

User.hasMany(Players, { foreignKey: 'user_id' });
Players.belongsTo(User, { foreignKey: 'user_id' });

// 3. Export everything
module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  GameSession,
  Players,
};

module.exports = { sequelize, Sequelize, DataTypes, User };
