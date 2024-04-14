import { check, validationResult } from "express-validator";

// login schema validation
const loginSchema = () => {
  return [
    check("email").isEmail().withMessage("Please enter valid email"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];
};

// register schema validation
const registerSchema = () => {
  return [
    check("email").isEmail().withMessage("Please enter your email."),
    check("first_name")
      .notEmpty()
      .withMessage("First name is required.")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long."),
    check("last_name")
      .notEmpty()
      .withMessage("Last name is required.")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];
};

// refresh tokens
const refreshTokenShema = () => {
  return [
    check("refreshToken")
      .notEmpty()
      .withMessage("refreshToken field is required."),
  ];
};

// revoke Refresh Tokens
const revokeRefreshTokensSchema = () => {
  return [check("userID").notEmpty().withMessage("userId field is required.")];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
  //   const extractedErrors = [];
  //   errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  //   return res.status(422).json({
  //     errors: extractedErrors,
  //   });
};

export {
  loginSchema,
  registerSchema,
  refreshTokenShema,
  revokeRefreshTokensSchema,
  validate,
};
