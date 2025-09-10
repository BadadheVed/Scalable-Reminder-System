import { login, SignUp, logout } from "@/controllers/login.controller";

import { Router } from "express";

export const authRouter = Router();

authRouter.use("/login", login);
authRouter.use("/signup", SignUp);
authRouter.use("/logout", logout);
