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
  tx = prisma,
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

  const conflicts = await tx.showschedules.findMany({
    where: {
      showId,
      datetime: {
        in: schedules.map((s) => s.datetime),
      },
    },
  });

  if (conflicts.length > 0) {
    const conflictDetails = conflicts.map((s) => s.datetime.toISOString().replace("T", " ").slice(0, 16));
    throw new AppError(
      `Conflicting schedules already exist for: ${conflictDetails.join(", ")}`,
      HttpStatusCodes.Conflict
    );
  }

  await tx.showschedules.createMany({
    data: schedules,
  });

  return schedules.map(({ scheduleId, datetime }) => ({
    scheduleId,
    datetime,
  }));
};

export const generateScheduleTickets = async ({
  tx,
  scheduleId,
  seatPricing,
  seats,
  ticketPrice,
  controlNumbers,
  seatingConfiguration,
}) => {
  const tickets = [];

  const orchestra = controlNumbers?.orchestra || [];
  const balcony = controlNumbers?.balcony || [];
  const complimentary = controlNumbers?.complimentary || [];

  const isControlled = seatingConfiguration === "controlledSeating";
  const isFixedPrice = seatPricing === "fixed";

  for (const num of [...orchestra, ...balcony]) {
    let seatNumber;
    let price = ticketPrice;

    if (isControlled) {
      const seat = seats.find((s) => s.ticketControlNumber === num);
      seatNumber = seat?.seatNumber;
      if (!isFixedPrice) price = seat?.ticketPrice;
    }

    tickets.push({
      ticketId: crypto.randomUUID(),
      scheduleId,
      controlNumber: num,
      seatNumber: isControlled ? seatNumber : undefined,
      ticketPrice: isFixedPrice ? ticketPrice : price,
      isComplimentary: false,
    });
  }

  for (const num of complimentary) {
    let seatNumber;

    if (isControlled) {
      const seat = seats.find((s) => s.ticketControlNumber === num);
      seatNumber = seat?.seatNumber;
    }

    tickets.push({
      ticketId: crypto.randomUUID(),
      scheduleId,
      controlNumber: num,
      seatNumber: isControlled ? seatNumber : undefined,
      ticketPrice: 0,
      isComplimentary: true,
    });
  }

  await tx.ticket.createMany({ data: tickets });
};

export const generateSeats = async ({ tx, seats, schedId }) => {
  await tx.showseats.createMany({
    data: seats.map((s) => ({
      scheduleId: schedId,
      seatNumber: s.seatNumber,
      seatSection: s.section,
      x: s.x,
      y: s.y,
    })),
  });
};

export const getShowSchedules = async (showId) => {
  return await prisma.showschedules.findMany({ where: { showId } });
};
