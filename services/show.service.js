import prisma from "../utils/primsa.connection.js";

export const doesShowExist = async (showId) => {
  const existingShow = await prisma.shows.findUnique({
    where: { showId },
    select: { showId: true },
  });

  return !!existingShow;
};

export const createShow = async ({ showTitle, coverImage, description, department, genre = [], createdBy, showType }) => {
  const newShow = await prisma.shows.create({
    data: {
      showId: crypto.randomUUID(),
      title: showTitle,
      description,
      showType,
      departmentId: department,
      createdBy,
      showCover: coverImage,
      showgenre: {
        create: genre.map((name) => ({
          genre_showgenre_genreTogenre: {
            connectOrCreate: {
              where: { name: name.trim() },
              create: { name: name.trim() },
            },
          },
        })),
      },
    },
  });

  return newShow;
};

export const getShows = async ({ departmentId, showType, isArchived = false }) => {
  const where = {
    ...(departmentId && { departmentId }),
    ...(showType ? { showType } : { showType: { in: ["majorConcert", "showCase"] } }),
    isArchived,
  };

  const shows = await prisma.shows.findMany({
    where,
    include: {
      showschedules: true,
      department: true,
      showgenre: {
        include: {
          genre_showgenre_genreTogenre: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const transformedShows = shows.map(({ showgenre, ...rest }) => ({
    ...rest,
    genreNames: showgenre.map((g) => g.genre_showgenre_genreTogenre.name),
  }));

  return { shows: transformedShows };
};

export const getShow = async ({ id }) => {
  return await prisma.shows.findFirst({
    where: {
      showId: id,
    },
    include: {
      showschedules: true,
      department: true,
      showgenre: {
        include: {
          genre_showgenre_genreTogenre: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

export const archiveShow = async (showId) => {
  return await prisma.shows.update({
    where: { showId },
    data: { isArchived: true },
  });
};

export const unArchiveShow = async (showId) => {
  return await prisma.shows.update({
    where: { showId },
    data: { isArchived: false },
  });
};

export const deleteShow = async (showId) => {
  return await prisma.shows.delete({
    where: { showId },
  });
};
