import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { addShowSchedule, generateScheduleTickets, generateSeats, getShowSchedules } from "../services/schedule.service.js";
import { doesShowExist } from "../services/show.service.js";
import { convertDates } from "../utils/convert.utils.js";
import prisma from "../utils/primsa.connection.js";

export const getShowSchedulesController = asyncHandler(async (req, res) => {
  const { showId } = req.query;

  const exists = doesShowExist(showId);

  if (!exists) {
    throw new AppError("Show Not Found", HttpStatusCodes.NotFound);
  }

  const schedules = await getShowSchedules(showId);
  res.json({ schedules });
});

export const addShowScheduleController = asyncHandler(async (req, res) => {
  const { ticketType, showId, dates, seatingConfiguration } = req.body;

  switch (ticketType) {
    case "ticketed": {
      const { commissionFee, contactNumber, facebookLink, controlNumbers, seatPricing, seats, ticketPrice } = req.body;

      const formattedDates = convertDates(dates);

      await prisma.$transaction(async (tx) => {
        const createdSchedules = await addShowSchedule({
          dates: formattedDates,
          showId,
          seatingType: seatingConfiguration,
          ticketType,
          commissionFee,
          contactNumber,
          facebookLink,
          tx,
        });

        for (const sched of createdSchedules) {
          if (seatingConfiguration === "freeSeating") {
            await generateScheduleTickets({
              scheduleId: sched.scheduleId,
              ticketPrice,
              controlNumbers,
              seatingConfiguration,
              tx,
            });
          } else if (seatingConfiguration === "controlledSeating") {
            await generateScheduleTickets({
              seatPricing,
              seatingConfiguration,
              seats,
              scheduleId: sched.scheduleId,
              ticketPrice,
              controlNumbers,
              tx,
            });
            await generateSeats({ tx, seats, schedId: sched.scheduleId });
          }
        }
      });

      res.status(HttpStatusCodes.OK).json({ message: "Schedules Added" });
      break;
    }

    case "nonTicketed": {
      await addShowSchedule({
        dates: convertDates(dates),
        showId,
        seatingType: seatingConfiguration,
        ticketType,
      });

      res.status(HttpStatusCodes.OK).json({ message: "Schedules Added" });
      break;
    }

    default:
      throw new AppError("Invalid Ticket Type Value", HttpStatusCodes.BadRequest);
  }
});
