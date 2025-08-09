import prisma from "../utils/primsa.connection.js";

export const getAllShowsForMenu = async () => {
  return await prisma.shows.findMany({
    where: {
      isArchived: false,
    },
    select: {
      showId: true,
      title: true,
      departmentId: true,
      showCover: true,
      showType: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // return { shows };
};

export const getDepartmentsForMenu = async () => {
  return await prisma.department.findMany({
    select: {
      departmentId: true,
      name: true,
    },
  });

  // return { departments }
};

export const getSelectedShowDetails = async (showId) => {
  return await prisma.shows.findUnique({
    where: { showId },
    select: {
      title: true,
      showCover: true,
      description: true,
      showgenre: {
        include: {
          genre_showgenre_genreTogenre: {
            select: {
              name: true,
            },
          },
        },
      },
      showschedules: {
        // where: {
        //   isArchived: false,
        //   isOpen: true,
        //   datetime: {
        //     gte: new Date(),
        //   },
        // },
        select: {
          scheduleId: true,
          datetime: true,
        },
        orderBy: {
          datetime: "asc",
        },
      },
    },
  });

  // return { selectedShow };
};

export const getSelectedShowSeats = async () => {};

export const submitReservationDetails = async () => {};

export const searchReservation = async () => {};
