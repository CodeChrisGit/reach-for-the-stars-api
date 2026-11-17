const router = require('express').Router();
const rules = require('../validators/auth.validator');
const validate = require('../middlewares/validate');          // ADJUST: your Week 11 validate file
const controller = require('../controllers/auth.controller');

router.post('/register', rules.register, validate, controller.register);
router.post('/login', rules.login, validate, controller.login);
// currentUser (mounted in routes/index.js) already read the token;
// the controller answers 401 when nobody is logged in.
router.get('/me', controller.me);

module.exports = router;