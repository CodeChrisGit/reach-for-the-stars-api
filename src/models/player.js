module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    current_streak: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    best_streak: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    correct_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    answer_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total_answer_ms: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
    double_star_ready: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    protection_ready: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    current_question_id: { type: DataTypes.INTEGER, allowNull: true },
    question_served_at: { type: DataTypes.DATE, allowNull: true },
    joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'players',
    timestamps: false,
  });

  Player.associate = (models) => {
    Player.belongsTo(models.GameSession, { foreignKey: 'session_id', as: 'session' });
  };

  return Player;
};