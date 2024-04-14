import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";

function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

function findUserByOtp(email, otp) {
  return prisma.user.findMany({
    where: {
      email,
      otp,
    },
    select: {
      id: true,
      email: true,
      otp: true,
      reset_password_expiry: true,
    },
  });
}

function findUserByEmailandRole(email) {
  return prisma.user.findMany({
    where: {
      email,
      role: 0,
    },
  });
}

function createUserByEmailAndPassword(user) {
  return prisma.user.create({
    data: user,
  });
}

function createUserByEmail(user) {
  console.log("createUserByEmail data", user);
  return prisma.user.create({
    data: user,
  });
}

function createImageById(data) {
  console.log("createImageById data", data);
  return prisma.usersImages.create({
    data,
  });
}

function updateUserByEmail(email, data) {
  if (data && data.password != undefined) {
    data.password = bcrypt.hashSync(data.password, 12);
  }
  console.log("updateUserByEmail data", email, data);
  return prisma.user.update({
    where: {
      email,
    },
    data,
  });
}

function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

function updateUserById(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  createUserByEmail,
  updateUserById,
  updateUserByEmail,
  findUserByEmailandRole,
  findUserByOtp,
  createImageById,
};
