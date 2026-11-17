const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');
const { unauthorized } = require('../errors/app-error');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(matchedData(req));
    res.status(201).json({ user });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    res.status(200).json(await authService.login(matchedData(req)));
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    // req.account is the full account set by current-user.js (null user = no token)
    if (!req.account) throw unauthorized('Authentication required.', 'NO_TOKEN');
    res.status(200).json({ user: authService.toJson(req.account) });
  } catch (err) { next(err); }
};