import { Request, Response } from "express";
import { verifyToken } from "@/tokens/token";
export const authMiddleware = (req: Request, res: Response, next: Function) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = verifyToken(token);
    (req as any).user = decoded; // attach user payload
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
