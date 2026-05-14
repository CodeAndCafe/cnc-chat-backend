declare namespace Express {
  interface Request {
    user?: {
      id: number;
      user_name: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  }
}
