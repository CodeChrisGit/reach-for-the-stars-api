const router = require('express').Router();
const requireUser = require('../middlewares/require-user');
const controller = require('../controllers/user.controller');
const authRules = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const { idParam } = require('../validators/question-set.validator');

router.use(requireUser('ADMIN'));

router.get('/', controller.list);
router.patch('/:id/role', idParam, authRules.roleRules, validate, controller.updateRole);

module.exports = router;