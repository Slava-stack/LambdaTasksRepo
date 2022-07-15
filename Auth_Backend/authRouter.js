const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');

router.post('/sign_up', [
    check('email', "e-mail mustn't be empty").notEmpty(),
    check('email', "this is not e-mail, please input correct e-mail").contains('@').contains('.'),
    check('password', "password must be bigger than 4 chars").isLength({min:4, max:30})
], controller.signUp);

router.post('/login', controller.signIn);

router.get('/me:request_number', controller.getUser);

router.get('/refresh', controller.refreshToken);

module.exports = router;