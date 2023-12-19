import { JWT_MAX_AGE } from "@/constants/constants";
import { SignJWT, jwtVerify } from "jose";

export const signTokens = async ({
  email,
  username,
}: {
  email?: string;
  username?: string;
}): Promise<string | null> => {
  if (!(email || username)) {
    console.error("JWT payload is undefined");
    return null;
  }
  if (!process.env.JWT_SECRET) {
    console.error(
      "JWT secret is missing. You need to provide one to generate a token"
    );
    return null;
  }
  try {
    const token = await new SignJWT({ username, email })
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
}): Promise<boolean> => {
  if (!process.env.JWT_SECRET) {
    console.error(
      "JWT secret is missing. You need to provide one to generate a token"
    );
    return false;
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return true;
  } catch (error: any) {
    console.error("In verify token", error);
    return false;
  }
};
