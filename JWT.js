const { sign, verify } = require("jsonwebtoken");
const env = process.env.NODE_ENV || 'development';

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    process.env.SECRET
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "Usuário não está autenticado!" });

  try {
    const validToken = verify(accessToken,  process.env.SECRET);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };
