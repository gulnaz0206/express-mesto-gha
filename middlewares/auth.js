const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  const token = cookie.replace('; foo=bar', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
