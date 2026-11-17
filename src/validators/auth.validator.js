const { body } = require('express-validator');

// NOTE: no rule for "role" here. With matchedData(req), any field
// without a rule is dropped, so a client cannot ask for ADMIN.
const register = [
  body('school_id').isString().trim().matches(/^\d{4}-\d{4}$/) // format like 2099-0001
    .withMessage('school_id format is invalid'),
  body('full_name').isString().trim().isLength({ min: 2, max: 100 }),
  body('email').isString().trim().isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 72 }) // bcrypt reads only 72 bytes
    .matches(/[A-Za-z]/).withMessage('password needs a letter')
    .matches(/\d/).withMessage('password needs a number'),
];

const login = [
  body('school_id').isString().trim().notEmpty(),
  body('password').isString().notEmpty(),
];

const roleRules = [
  body('role').isIn(['PLAYER', 'HOST', 'ADMIN']),
];

module.exports = { register, login, roleRules };