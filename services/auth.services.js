import prisma from "../utils/primsa.connection.js";

export const createTrainerAccountService = async ({ firstName, lastName, userTypeId, email, password }) => {
  const newTrainer = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  await prisma.userRoles.create({
    data: {
      roleId: userTypeId,
      userId: newTrainer.userId,
    },
  });

  return newTrainer;
};
