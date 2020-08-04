const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/users');
const authentication = require('./../../middlewares/authentication');
const logger = require('./../../middlewares/logger');

router.route('/')
    .get(authentication, controller.getUsers)
    .post(logger, controller.newUser)
    .delete(logger,controller.deleteUser);

router.route('/login')
        .post(logger, controller.loginUser);

router.route('/:id')
    .get(controller.getUser)
    .put(logger, controller.updateUser);

router.get('/:id/tweets', controller.listUserTweets);

module.exports = router;