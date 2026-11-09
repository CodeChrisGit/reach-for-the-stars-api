const sessionRepository = require('../repositories/session.repository');
const playerRepository = require('../repositories/player.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game session has the code ${code}.`);
  }
  return session;
}

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function create(questionSetId, user) {
  const questionSet = await questionSetRepository.findById(questionSetId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${questionSetId}.`);
  }
  
  const mayUse = questionSet.host_id === user.user_id || questionSet.is_public || user.role === 'ADMIN';
  if (!mayUse) throw forbidden('This question set belongs to another host.');

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await sessionRepository.create({
        question_set_id: questionSet.id,
        host_id: user.user_id,
        join_code: randomCode(),
        status: 'WAITING',
        duration_sec: 300,
      });
    } catch (error) {
      if (constraintOf(error) !== 'game_sessions_join_code_key') throw error;
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

const NEXT_STATUS = {
  WAITING: ['ACTIVE', 'ENDED'],
  ACTIVE: ['ENDED'],
  ENDED: [],
};

const API_STATUS = {
  WAITING: 'LOBBY',
  ACTIVE: 'RUNNING',
  ENDED: 'CLOSED',
};

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }
  const nextStatus = status === 'RUNNING' ? 'ACTIVE' : 'ENDED';
  if (!NEXT_STATUS[session.status].includes(nextStatus)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${API_STATUS[session.status] || session.status} game cannot become ${status}.`);
  }
  
  const changes = { status: nextStatus };
  if (nextStatus === 'ACTIVE') changes.started_at = new Date();
  if (nextStatus === 'ENDED') changes.ended_at = new Date();
  
  return sessionRepository.update(session, changes);
}

function toApiStatus(status) {
  return API_STATUS[status] || status;
}

module.exports = { findOrFail, create, changeStatus, toApiStatus };