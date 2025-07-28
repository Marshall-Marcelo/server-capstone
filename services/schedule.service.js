import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import prisma from "../utils/primsa.connection.js";

export const addShowSchedule = async ({
  dates = [],
  showId,
  seatingType,
  ticketType,
  contactNumber = null,
  facebookLink = null,
  commissionFee = 0,
}) => {
  const schedules = dates.map(({ datetime }) => ({
    scheduleId: crypto.randomUUID(),
    showId,
    datetime,
    commissionFee,
    seatingType,
    ticketType,
    contactNumber,
    facebookLink,
  }));

  const conflicts = await prisma.showschedules.findMany({
    where: {
      showId,
      datetime: {
        in: schedules.map((s) => s.datetime),
      },
    },
  });

  if (conflicts.length > 0) {
    const conflictDetails = conflicts.map((s) => s.datetime.toISOString().replace("T", " ").slice(0, 16));
    throw new AppError(`Conflicting schedules already exist for: ${conflictDetails.join(", ")}`, HttpStatusCodes.Conflict);
  }

  await prisma.showschedules.createMany({
    data: schedules,
  });

  return schedules.map(({ scheduleId, datetime }) => ({
    scheduleId,
    datetime,
  }));
};

export const generateScheduleTickets = async ({
  scheduleId,
  ticketPrice = null,
  sectionedPrice = {
    orchestraLeft: null,
    orchestraMiddle: null,
    orchestraRight: null,
    balconyLeft: null,
    balconyMiddle: null,
    balconyRight: null,
  },
  controlNumbers: { orchestra = [], balcony = [], complimentary = [] },
}) => {
  const tickets = [];

  for (const num of orchestra) {
    tickets.push({
      ticketId: crypto.randomUUID(),
      scheduleId,
      controlNumber: num,
      ticketPrice,
      isComplimentary: false,
    });
  }

  for (const num of balcony) {
    tickets.push({
      ticketId: crypto.randomUUID(),
      scheduleId,
      controlNumber: num,
      ticketPrice,
      isComplimentary: false,
    });
  }

  for (const num of complimentary) {
    tickets.push({
      ticketId: crypto.randomUUID(),
      scheduleId,
      controlNumber: num,
      ticketPrice: 0,
      isComplimentary: true,
    });
  }

  await prisma.ticket.createMany({
    data: tickets,
  });

  return { created: tickets.length };
};

export const getShowSchedules = async (showId) => {
  return await prisma.showschedules.findMany({ where: { showId } });
};
