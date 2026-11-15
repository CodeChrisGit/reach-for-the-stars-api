const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const gameInfo = require('../config/game-info');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.listBySession(session.id);
}

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  const seat = await playerRepository.findSeat(session.id, user.user_id);
  if (seat) {
    return { session, player: seat, created: false };
  }

  if (session.status === 'ENDED') throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== 'WAITING') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }
  
  const seatsTaken = await playerRepository.countBySession(session.id);
  if (seatsTaken >= gameInfo.max_players) {
    throw conflict('SESSION_FULL', 'This game is full.');
  }

  try {
    const player = await playerRepository.create({
      session_id: session.id,
      user_id: user.user_id,
      nickname,
    });
    return { session, player, created: true };
  } catch (error) {
    if (constraintOf(error) === 'uq_one_seat') {
      const existing = await playerRepository.findSeat(session.id, user.user_id);
      return { session, player: existing, created: false };
    }
    throw error;
  }
}

module.exports = { list, join };