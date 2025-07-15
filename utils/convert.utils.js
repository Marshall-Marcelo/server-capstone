export const convertDates = (dates) => {
  return dates.map(({ date, time }) => {
    const parsedDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);

    const combined = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), hours, minutes, 0, 0);

    return { datetime: combined };
  });
};
