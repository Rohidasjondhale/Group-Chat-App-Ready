const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {

  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {

    const decoded = jwt.verify(token, "secretkey");

    socket.userId = decoded.userId;

    next();

  } catch (err) {

    return next(new Error("Authentication error: Invalid token"));

  }

};