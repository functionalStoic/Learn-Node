/* @flow */
const express = require('express');
const router = express.Router();
const { homePage } = require('../controllers/storeController');

router.get('/', homePage);

module.exports = router;
