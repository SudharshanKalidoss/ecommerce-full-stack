const errorHandler = (error, req, res, next) => {
  console.log(error.statusCode);
  error.statusCode = error.statusCode || 500;
  return res
    .status(error.statusCode)
    .send({ error: error.message || "Oops! Something went wrong" });
};
module.exports = errorHandler;
