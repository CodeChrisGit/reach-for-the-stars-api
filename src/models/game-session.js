module.exports = (sequelize, DataTypes) => {
  const GameSession = sequelize.define('GameSession', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    host_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_set_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    join_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'WAITING'
    },
    duration_sec: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'game_sessions',
    timestamps: false // Handled via migration
  });

  GameSession.associate = (models) => {
    GameSession.belongsTo(models.QuestionSet, { foreignKey: 'question_set_id', as: 'questionSet' });
    GameSession.belongsTo(models.User, { foreignKey: 'host_id', as: 'host' });
    GameSession.hasMany(models.Player, { foreignKey: 'session_id' });
  };

  return GameSession;
};