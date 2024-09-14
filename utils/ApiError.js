class ApiError extends Error {
  constructor(
    statusCode, // HTTP status code (e.g., 404, 500)
    message = "Somethings went wrong", // Default message agar koi custom message nahi diya
    errors = [], // Additional errors ka array, default empty
    stack = "", // Stack trace, agar nahi di toh automatically generate hogi
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export {ApiError}
