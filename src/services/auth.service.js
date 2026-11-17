const jwt = require('jsonwebtoken');
const password = require('../security/password');   // the kit's hash() and matches()
const token = require('../security/token');         // the kit's issue() and verify()
const { unauthorized } = require('../errors/app-error');
const userRepository = require('../repositories/user.repository');

function toJson(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

async function register({ school_id, full_name, email, password: plain }) {
  const password_hash = await password.hash(plain);
  // role is ALWAYS PLAYER, never taken from the request
  const user = await userRepository.create({
    school_id, username: school_id, full_name, email, password_hash, role: 'PLAYER',
  });
  return toJson(user);
}

async function login({ school_id, password: plain }) {
  const user = await userRepository.findForLogin(school_id);
  const ok = await password.matches(plain, user ? user.password_hash : null);
  if (!ok) throw unauthorized('Invalid school ID or password', 'INVALID_CREDENTIALS');

  const signed = token.issue(user);
  const { exp, iat } = jwt.decode(signed); // lifetime in seconds, read from the token itself
  return { token: signed, token_type: 'Bearer', expires_in: exp - iat, user: toJson(user) };
}

module.exports = { register, login, toJson };