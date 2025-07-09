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

export const getShows = async ({ offSet, limit, departmentId, showType, search }) => {
  const baseWhere = {
    ...(departmentId && { departmentId }),
    showType: { in: ["majorConcert", "showCase"] },
    ...(showType && { showType }),
    ...(search && {
      title: {
        contains: search,
      },
    }),
  };

  const [shows, total, totalMajorConcert, totalShowCase] = await Promise.all([
    prisma.shows.findMany({
      where: baseWhere,
      skip: offSet,
      take: limit,
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
    }),
    prisma.shows.count({ where: baseWhere }),
    prisma.shows.count({
      where: {
        ...baseWhere,
        showType: "majorConcert",
      },
    }),
    prisma.shows.count({
      where: {
        ...baseWhere,
        showType: "showCase",
      },
    }),
  ]);

  return {
    shows,
    total,
    totalMajorConcert,
    totalShowCase,
  };
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
