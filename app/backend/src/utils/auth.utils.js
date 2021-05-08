const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

module.exports = {
  //create the access token with the shorter lifespan
  createAccessToken(id) {
    let accessToken = jwt.sign({ id }, config.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: config.ACCESS_TOKEN_LIFE,
    });
    return accessToken;
  },

  //create the refresh token with the longer lifespan
  createRefreshToken(id) {
    let refreshToken = jwt.sign({ id }, config.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: config.REFRESH_TOKEN_LIFE,
    });
    return refreshToken;
  },

  sendAccessToken(res, accesstoken, username) {
    res.status(200).json({
      accesstoken,
      username,
    });
  },

  sendRefreshToken(res, refreshToken) {
    return res.cookie("refreshtoken", refreshToken, {
      httpOnly: false,
      path: "/refresh_token",
    });
  },
};
