export const CODES = {
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  NOT_IMPLEMENTED: 501,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVICE_UNAVAILABLE: 503,
  TOO_MANY_REQUESTS: 429,
};
type CodeT = keyof typeof CODES;

export class HttpError extends Error {
  status: number;
  code: CodeT;
  data?: object;
  constructor({ message, code, status, data }: { message: string; code?: CodeT; status?: number; data?: object }) {
    super(message);
    if (!status && code) {
      status = CODES[code];
    }
    if (!code && status) {
      code = Object.keys(CODES).find((key) => CODES[key as CodeT] === status) as CodeT;
    }
    if (!status && !code) {
      status = 500;
      code = 'INTERNAL_SERVER_ERROR';
    }
    if (!status || !code) {
      throw new Error('Invalid error status or code');
    }
    this.status = status;
    this.code = code;
    this.data = data;
    this.message = message;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}
