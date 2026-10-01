export default function GlobalError(err, req, res, next) {
  // 1. Print full details in the terminal so you can diagnose issues quickly
  console.error("\n================ GLOBAL ERROR CAUGHT ================");
  console.error("Name   :", err.name);
  console.error("Message:", err.message);
  console.error("Stack  :", err.stack);
  console.error("====================================================\n");

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // 2. Handle Mongoose Schema Validation Errors (e.g. invalid type, missing field)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // 3. Handle Duplicate Key Error (e.g. email or phone already registered)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // 4. Handle CastError (invalid ObjectId or incorrect type cast)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // 5. Handle Multer Errors (e.g. file size limit, unexpected field)
  if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Send the real error details back to the client
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}