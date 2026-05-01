const JWT = require("jsonwebtoken");
const { ApiError } = require("../middlewares/api-errors");
const { ERROR_MESSAGES } = require("../utils/error-messages");

exports.signAccessToken = (payload) => {
  const options = { expiresIn: "7d" };
  const token = JWT.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, options);
  return token;
};

exports.signRefreshToken = (payload) => {
  const options = { expiresIn: "7d" };
  const token = JWT.sign(
    payload,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    options
  );
  return token;
};

exports.verifyAccessToken = (token) => {
  try {
    const decoded = JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw ApiError.Unauthorized;
  }
};


exports.verifyRefreshToken = (token) => {
  try {
    const decoded = JWT.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    // ❌ In your version, `vendorId` and `email` are not destructured but still returned.
    // That would throw a ReferenceError.
    const { id, roleId, vendorId, email } = decoded;
    return { id, roleId, vendorId, email };
  } catch (error) {
    console.log(error , "asdadsasdsadsadasdsad")
    throw ApiError.Unauthorized("Invalid or expired refresh token");
  }
};



exports.authenticate = async (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ");
  const token = bearerToken && bearerToken[bearerToken.length - 1];


  console.log("Token in authenticate middleware:", token);


  try {

    if (!token) {
      throw ApiError.Unauthorized(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }
    const where = { accessToken: token }
    const fieldsToBeIncluded = ["id", "accessToken"]

    // const atoken = accessToken.accessToken;
    const decoded = this.verifyAccessToken(token);
    const { id, role, email } = decoded;
    req.user = { id, role, email };

    console.log(req.user, "req.user")
    next();
  } catch (error) {
    console.log("Authentication error:", error);
    return next(ApiError.Unauthorized(error.message));
  }
};







exports.authenticateWithoutError = async (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ");
  const token = bearerToken && bearerToken[bearerToken.length - 1];

  try {

    if (!token) {
      next();
    }
    const where = { accessToken: token }
    const fieldsToBeIncluded = ["id", "accessToken"]


    const atoken = accessToken.accessToken;
    const decoded = this.verifyAccessToken(atoken);
    const { id, roleId, vendorId, email } = decoded;
    req.user = { id, roleId, vendorId, email };
    next();
  } catch (error) {
    // return next(ApiError.Unauthorized(error.message));
  }
};


