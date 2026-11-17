const { matchedData } = require('express-validator');
const userRepository = require('../repositories/user.repository');
const { toJson } = require('../services/auth.service');
const { conflict, notFound } = require('../errors/app-error');

async function list(req, res, next) {
  try {
    const users = await userRepository.findAll();
    res.status(200).json({ users: users.map(toJson) });
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const targetId = req.params.id;
    const { role } = matchedData(req);

    if (String(req.user.user_id) === String(targetId)) {
      throw conflict('CANNOT_CHANGE_OWN_ROLE', 'Admins cannot change their own role');
    }

    const user = await userRepository.findById(targetId);
    if (!user) {
      throw notFound('USER_NOT_FOUND', 'User not found');
    }

    const updatedUser = await userRepository.update(user, { role });
    if (!updatedUser) {
      throw notFound('USER_NOT_FOUND', 'User not found');
    }

    res.status(200).json({ user: toJson(updatedUser) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  updateRole,
};