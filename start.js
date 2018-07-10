const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle any bad connections
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on(
  'error',
  ({ message }) => console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${message}`) // eslint-disable-line no-console
);

// READY?! Let's go!

// Import our models
require('./models/Store');
require('./models/User');

// Start our app!
const app = require('./index');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`); // eslint-disable-line no-console
});
