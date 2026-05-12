export class AppError extends Error {
  constructor(
    public messsage: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(messsage);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
export class RateLimtiError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}
