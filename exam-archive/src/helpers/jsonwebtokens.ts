import { JWTPayload, SignJWT, jwtVerify } from "jose";

export const signTokens = async ({
  JWTPayload,
  JWT_MAX_AGE,
}: {
  JWTPayload: IJWTPayload;
  JWT_MAX_AGE: string | number;
}): Promise<string | null> => {
  if (!process.env.JWT_SECRET) {
    console.error(
      "JWT secret is missing. You need to provide one to generate a token"
    );
    return null;
  }

  try {
    const token = await new SignJWT(JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_MAX_AGE)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    return token;
  } catch (error: any) {
    console.error("In sign token", error);
    return null;
  }
};

export const verifyTokens = async ({
  token,
}: {
  token: string;
}): Promise<boolean | JWTPayload> => {
  if (!process.env.JWT_SECRET) {
    console.error(
      "JWT secret is missing. You need to provide one to generate a token"
    );
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error: any) {
    console.error("In verify token", error.message);
    return false;
  }
};
