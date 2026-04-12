export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    // Fix prototype chain (quan trọng trong TS)
    Object.setPrototypeOf(this, new.target.prototype);
    // Clean stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
