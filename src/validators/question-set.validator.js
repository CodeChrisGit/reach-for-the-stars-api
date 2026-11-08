const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const title = () => body('title')
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 255 }).withMessage('title must be 3 to 255 characters long');

const description = () => body('description')
  .optional({ values: 'null' })
  .isString().withMessage('description must be text')
  .bail()
  .trim();

const subject = () => body('subject')
  .optional({ values: 'null' })
  .isString().withMessage('subject must be text')
  .bail()
  .trim()
  .isLength({ max: 100 }).withMessage('subject must be at most 100 characters long');

const gradeLevel = () => body('grade_level')
  .optional({ values: 'null' })
  .isString().withMessage('grade_level must be text')
  .bail()
  .trim()
  .isLength({ max: 50 }).withMessage('grade_level must be at most 50 characters long');

const createRules = [title(), description(), subject(), gradeLevel()];

const updateRules = [
  idParam,
  title().optional(),
  description(),
  subject(),
  gradeLevel(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['title', 'description', 'subject', 'grade_level'].includes(key))) {
      throw new Error('send at least one of: title, description, subject, grade_level');
    }
    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };