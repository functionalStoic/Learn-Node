exports.myMiddleware = (req, res, next) => {
  req.name = 'Jason';
  next();
};

exports.homePage = (req, res) => {
  res.render('index');
};
