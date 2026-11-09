const { Player } = require('../models');

function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

function countBySession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

function listBySession(sessionId) {
  return Player.findAll({
    attributes: ['nickname', 'stars'],
    where: { session_id: sessionId },
    order: [['stars', 'DESC'], ['nickname', 'ASC']],
  });
}

function create(data) {
  return Player.create(data);
}

module.exports = { findSeat, countBySession, listBySession, create };