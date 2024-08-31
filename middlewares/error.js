module.exports = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || 500,
    status: err.status || 'error',
    message: err.message,
  };
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
  next();
};
