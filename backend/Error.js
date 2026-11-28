export default function GlobalError(err, req, res, next) {
  console.error("Request error:", err);

  let statusCode = err.statusCode || err.status || 500;
  let message =
    statusCode >= 500
      ? "Something went wrong. Please try again later."
      : err.message || "Request failed";

  const isDatabaseUnavailable =
    err.code === "MONGODB_URL_MISSING" ||
    [
      "MongooseServerSelectionError",
      "MongoServerSelectionError",
      "MongoNetworkError",
      "MongoNetworkTimeoutError",
    ].includes(err.name) ||
    (err.name === "MongooseError" &&
      /buffering timed out/i.test(err.message || ""));

  if (isDatabaseUnavailable) {
    statusCode = 503;
    message = "Service is temporarily unavailable. Please try again shortly.";
  } else if (typeof err.code === "string" && err.code.startsWith("RAZORPAY_")) {
    statusCode = err.statusCode || 502;
    message = "Online payment is temporarily unavailable. Please try again shortly.";
  }

  // 2. Handle Mongoose Schema Validation Errors (e.g. invalid type, missing field)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // 3. Handle Duplicate Key Error (e.g. email or phone already registered)
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // 4. Handle CastError (invalid ObjectId or incorrect type cast)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // 5. Handle Multer Errors (e.g. file size limit, unexpected field)
  else if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
}