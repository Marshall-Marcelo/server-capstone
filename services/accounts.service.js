import prisma from "../utils/primsa.connection.js";

export const getTrainers = async () => {
  const trainers = await prisma.users.findMany({
    where: { role: "trainer" },
    include: {
      department: {
        select: {
          name: true,
          departmentId: true,
        },
      },
    },
  });

  return trainers.map((t) => ({
    ...t,
    department: t.department?.[0] || null,
  }));
};

export const editAccount = async ({ userId, firstName, lastName, email }) => {
  const user = await checkEmailExistence(email);

  if (user) {
    throw new AppError("Email already used", HttpStatusCodes.Conflict);
  }

  return await prisma.users.update({
    where: {
      userId,
    },
    data: {
      firstName,
      lastName,
      email,
    },
  });
};
