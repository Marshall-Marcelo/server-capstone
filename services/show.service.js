import prisma from "../utils/primsa.connection.js";

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

export const getShows = async ({ departmentId, showType }) => {
  const baseWhere = {
    ...(departmentId && { departmentId }),
    showType: { in: ["majorConcert", "showCase"] },
    ...(showType && { showType }),
  };

  const shows = await prisma.shows.findMany({
    where: baseWhere,
    select: {
      showId: true,
      showType: true,
      title: true,
      department: {
        select: {
          name: true,
          departmentId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { shows };
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
