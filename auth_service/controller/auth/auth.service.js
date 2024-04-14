import prisma from "../../config/db.config.js";
import { hashToken } from "../../utils/hashToken.js";

const addRefreshTokenToWhitelist = ({ jti, refreshToken, userId }) => {
  return prisma.refreshToken.create({
    data: {
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

const findRefreshTokenById = (id) => {
  console.log("id!!", id);
  return prisma.refreshToken.findUnique({
    where: {
      userId: id.toString(),
    },
  });
};

const deleteRefreshToken = (id) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

const revokeTokens = (userId) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};

export {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
};
