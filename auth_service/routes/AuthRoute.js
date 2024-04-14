import { Router } from "express";
const router = Router();

// validation schema and validation
import {
  loginSchema,
  registerSchema,
  refreshTokenShema,
  revokeRefreshTokensSchema,
  validate,
} from "../validation/validator.js";

//controllers
import {
  register,
  login,
  refreshTokenFun,
  revokeRefreshTokens,
} from "../controller/auth/AuthController.js";

// routes
router.post("/login", loginSchema(), validate, login); // login
router.post("/register", registerSchema(), validate, register); // register
router.post("/refreshToken", refreshTokenShema(), validate, refreshTokenFun); // refreshToken
router.post(
  "/revokeRefreshTokens",
  revokeRefreshTokensSchema(),
  validate,
  revokeRefreshTokens
); // revokeRefreshTokens

export default router;
