/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

export const catchErrors = fn => (req, res, next) =>
  fn(req, res, next).catch(next);

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (req, res) => {
  res.status(404);
  res.format({
    html: () => res.render('error', { message: 'Not Found', status: 404 }),
    json: () => res.json({ error: { message: 'Not Found', status: 404 } }),
    default: () => res.type('txt').send('Not Found')
  });
};

/*
  MongoDB Validation Error Handler
  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/

export const flashValidationErrors = (err, req, res, next) => {
  // if there are no errors to show for flashes, skip it
  if (!err.errors) return next(err);

  // validation errors look like
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash('error', err.errors[key].message));
  res.redirect('back');
  next(err);
};

/*
  Development Error Handler
  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
export const developmentErrors = (err, req, res /* , next */) => {
  err.stack = err.stack || '';

  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    )
  };

  res.status(err.status || 500);

  // Return res based on the `Accept` http header
  res.format({
    // Form Submit, Reload the page
    html: () => res.render('error', errorDetails),
    // Ajax call, send JSON back
    json: () => res.json(errorDetails)
  });
};

/*
  Production Error Handler
  No stacktraces are leaked to user
*/
export const productionErrors = (err, req, res /* , next */) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};
