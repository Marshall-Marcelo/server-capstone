import prisma from "../utils/primsa.connection.js";

export const getAllShowsForMenu = async () => {
  const shows = await prisma.shows.findMany({
    where: {
      isArchived: false,
    },
    select: {
      showId: true,
      title: true,
      departmentId: true,
      showCover: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { shows };
};

export const getDepartmentsForMenu = async () => {
  const departments = await prisma.department.findMany({
    select: {
      departmentId: true,
      name: true,
    },
  });

  return { departments };
};

export const getSelectedShowDetails = async ({ showId }) => {
  const selectedShow = await prisma.shows.findUnique({
    where: { showId },
    select: {
      title: true,
      showCover: true,
      description: true,
      showgenre: {
        select: { genre: true },
      },
      showschedules: {
        where: {
          isArchived: false,
          isOpen: true,
        },
        select: {
          scheduleId: true,
          datetime: true,
        },
      },
    },
  });

  return { selectedShow };
};

export const getSelectedShowSeats = async () => {};

export const submitReservationDetails = async () => {};

export const searchReservation = async () => {};
