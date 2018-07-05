const express = require('express');
const router = express.Router();
const {
  getStores,
  addStore,
  createStore,
  updateStore,
  editStore
} = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));

router.get('/add', addStore);
router.post('/add', catchErrors(createStore));
router.post('/add/:id', catchErrors(updateStore));

router.get('/stores/:id/edit', catchErrors(editStore));

module.exports = router;
