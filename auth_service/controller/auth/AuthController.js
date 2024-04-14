import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { createUserByEmailAndPassword } from "../users/user.service.js";
import { generateTokens } from "../../utils/jwt.js";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from "./auth.service.js";
import { hashToken } from "../../utils/hashToken.js";
const salt = 10;

const register = async (req, res) => {
  const { first_name, last_name, oauth_provider, oauth_uid, email, password } =
    req.body;
  let encPassword = bcrypt.hashSync(password, salt);
  let userData = {
    first_name,
    last_name,
    oauth_provider,
    oauth_uid,
    email,
    password: encPassword,
    // unknow: true,
  };
  try {
    // check first existing user by unique email identifier
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists please try another one.",
      });
    }

    const user = await createUserByEmailAndPassword(userData);
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    const {
      id,
      first_name: firstName,
      last_name: lastName,
      email: emailId,
      picture,
    } = user;
    res.json({
      success: true,
      data: {
        id,
        first_name: firstName,
        last_name: lastName,
        email: emailId,
        picture,
      },
      authorisation: {
        token: accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
      }
      console.log("error!!!!!!: " + e);
      res.send(e);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if the user is valid or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentails." });
    }

    //compare password
    console.log("password", password);
    console.log("existingUser.password", existingUser.password);
    const validPassword = await bcrypt.compare(password, existingUser.password);
    console.log("validPassword", validPassword);
    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    const { id, first_name, last_name, email: emailId, picture } = existingUser;
    res.json({
      success: true,
      data: {
        id,
        first_name,
        last_name,
        email: emailId,
        picture,
      },
      authorisation: {
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshTokenFun = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    console.log("savedRefreshToken", savedRefreshToken);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
const revokeRefreshTokens = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
};

export { login, register, refreshTokenFun, revokeRefreshTokens };
