import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

export const generateToken = async (payload: TokenPayload) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);
    return token;
  } catch (error: any) {
    throw new Error("Error Generating Token");
  }
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    
    if (!token) {
      throw new Error("Token is required");
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as TokenPayload; // ✅ return the payload
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid token");
    } else if (error.name === 'TokenExpiredError') {
      throw new Error("Token has expired");
    } else if (error.name === 'NotBeforeError') {
      throw new Error("Token not active");
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
