import prisma from "../utils/primsa.connection.js";

export const getGenres = () => {
  return prisma.genre.findMany();
};
