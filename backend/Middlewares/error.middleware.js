export const globalErrorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    message,
  };

  if (err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};
