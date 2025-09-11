import { db } from "@/db/route";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/tokens/token";
import type { Request, Response, RequestHandler } from "express";

// Define interfaces for better type safety
interface LoginRequestBody {
  email: string;
  password: string;
}

interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
}

export const login: RequestHandler = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const User = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!User) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const payload = {
      id: User.id,
      email: User.email,
      name: User.name,
    };

    // Generate token
    const token = await generateToken(payload);
    const userName = User.name;

    console.log("Login successful, setting cookie...");
    console.log("Token:", token);
    console.log("Request origin:", req.headers.origin);
    console.log("Request host:", req.headers.host);

    // Determine if we're in production
    const isProduction = process.env.NODE_ENV === "production";

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: undefined,
      path: "/",
    };

    console.log("Cookie options:", cookieOptions);

    // Set the cookie
    res.cookie("token", token, cookieOptions);

    // Test cookie
    res.cookie("test", "working", {
      httpOnly: false,
      secure: false,
      sameSite: "lax" as const,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Cookies set, sending response...");

    // Send response
    res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      name: userName,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const SignUp: RequestHandler = async (
  req: Request<{}, {}, SignUpRequestBody>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      res.status(409).json({
        success: false,
        message: "Please Enter the name also",
      });
      return;
    }
    // Generate salt and hash password
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const existingUser = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    const newUser = await db.user.create({
      data: {
        email: email,
        password: hashedPass,
        name: name,
      },
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    // const token = await generateToken(payload);

    // if (!token) {
    //   res.status(500).json({
    //     message: "Error Generating Token",
    //     success: false,
    //   });
    //   return;
    // }

    res.status(201).json({
      // token: token,
      message: "Sign Up Successful",
      name: payload.name,
      success: true,
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout: RequestHandler = async (req: Request, res: Response) => {
  try {
    // Determine environment
    const isProduction = process.env.NODE_ENV === "production";

    // Clear the authentication cookie with same options used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      path: "/",
    });

    console.log("User logged out successfully");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const User = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    const decoded = verifyToken(token);
    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: "User fetched successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
