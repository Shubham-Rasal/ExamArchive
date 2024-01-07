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
