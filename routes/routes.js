const express = require('express');
const router = express.Router();
const {
  getStores,
  addStore,
  upload,
  resize,
  createStore,
  updateStore,
  editStore,
  getStoreBySlug,
  getStoresByTag,
  searchStores
} = require('../controllers/storeController');
const {
  loginForm,
  registerForm,
  validateRegister,
  register,
  account,
  updateAccount
} = require('../controllers/userController');
const {
  login,
  logout,
  isLoggedIn,
  forgot,
  reset,
  confirmedPasswords,
  update
} = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));

router.get('/add', isLoggedIn, addStore);
router.post('/add', upload, catchErrors(resize), catchErrors(createStore));
router.post('/add/:id', upload, catchErrors(resize), catchErrors(updateStore));

router.get('/stores/:id/edit', catchErrors(editStore));

router.get('/stores/:slug', catchErrors(getStoreBySlug));

router.get('/tags', catchErrors(getStoresByTag));
router.get('/tags/:tag', catchErrors(getStoresByTag));

router.get('/login', loginForm);
router.post('/login', login);

router.get('/register', registerForm);
router.post('/register', validateRegister, register, login);

router.get('/logout', logout);

router.get('/account', isLoggedIn, account);
router.post('/account', catchErrors(updateAccount));

router.post('/account/forgot', catchErrors(forgot));
router.get('/account/reset/:token', catchErrors(reset));
router.post('/account/reset/:token', confirmedPasswords, catchErrors(update));

/*
  API
*/

router.get('/api/search', catchErrors(searchStores));

module.exports = router;
