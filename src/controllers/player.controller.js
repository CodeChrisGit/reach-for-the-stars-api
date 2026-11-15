const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');
const sessionService = require('../services/session.service');

async function list(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const players = await playerService.list(code);
  res.status(200).json(players.map((player) => ({
    nickname: player.nickname,
    score: player.stars,
  })));
}

async function join(req, res) {
  const { code, nickname } = matchedData(req);
  const { session, player, created } = await playerService.join(code, nickname, req.user);

  res.status(created ? 201 : 200).json({
    player_id: player.id,
    nickname: player.nickname,
    score: player.stars,
    rejoined: !created,
    session: {
      code: session.join_code,
      status: sessionService.toApiStatus(session.status),
    },
  });
}

module.exports = { list, join };