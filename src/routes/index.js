// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Hub Contract endpoints: open to everyone, so they come before currentUser.
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));

// Protected route modules need the account resolved before their role guards run.
router.use(currentUser);

// Mount your modules here, one line each. For example:
router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./session.routes'));
router.use('/results', require('./results.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));

module.exports = router;
