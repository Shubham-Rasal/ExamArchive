interface IResponse {
  message: string;
}

interface IJWTPayload {
  [key: string]: string;
}

interface ICloudinaryPayload {
  filepath: string;
  tags: Array<string>;
}

interface IServerActionResponse {
  hasError: boolean;
  message?: string;
  statusCode: number;
}

interface IErrorHandler extends Error {
  statusCode: number;
}
