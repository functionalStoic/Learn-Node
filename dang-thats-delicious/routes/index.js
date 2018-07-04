/* @flow */
const express = require('express');
const router = express.Router();
const { homePage, myMiddleware } = require('../controllers/storeController');

router.get('/', myMiddleware, homePage);

module.exports = router;
