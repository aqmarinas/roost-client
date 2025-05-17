// rule
export const titleValidation = {
  required: "Title is required",
  minLength: {
    value: 5,
    message: "Title must be at least 5 characters",
  },
  pattern: {
    value: /^[A-Za-z0-9À-ÿ.,()\-_'"/# ]+$/,
    message: "Title contains invalid characters",
  },
};

export const nameValidation = {
  required: "Name is required",
  minLength: {
    value: 3,
    message: "Name must be at least 3 characters",
  },
  pattern: {
    value: /^[A-Za-zÀ-ÿ.'\-() ]+$/,
    message: "Name contains invalid characters",
  },
};

export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address",
  },
};

export const phoneValidation = {
  required: "Phone number is required",
  pattern: {
    value: /^(628|08)[0-9]{8,13}$/,
    message: "Phone number must start with '628' or '08' and contain 10 to 15 digits",
  },
};

// custom validator
export const validateDate = (value) => {
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today || "Date cannot be in the past";
};

export const validateStartTime = (value, date) => {
  if (!date) return true;

  const now = new Date();
  const selectedDateTime = new Date(`${date}T${value}:00`);

  if (selectedDateTime < now) return "Start time cannot be in the past";

  const hour = +value.split(":")[0];
  if (hour < 8 || hour >= 18) return "Start time must be between 08:00 and 18:00";

  return true;
};

export const validateEndTime = (value, date, startTime) => {
  if (!date || !startTime) return true;

  const selectedStart = new Date(`${date}T${startTime}:00`);
  const selectedEnd = new Date(`${date}T${value}:00`);
  const now = new Date();

  if (selectedEnd <= selectedStart) return "End time must be after start time";
  if (selectedEnd < now) return "End time cannot be in the past";

  const hour = +value.split(":")[0];
  if (hour < 8 || hour > 18) return "End time must be between 08:00 and 18:00";

  return true;
};

/**
 * check conflict
 * @param {Array} schedules - array jadwal (setiap elemen {date, startTime, endTime})
 * @param {Array} bookings - array booking dari backend
 * @param {String} room - room id yang dipilih
 */

// export const checkConflict = (schedules, bookings, room, setError, clearErrors) => {
//   if (!Array.isArray(schedules)) return false;

//   let hasError = false;

//   schedules.forEach((schedule, index) => {
//     const { date, startTime, endTime } = schedule;

//     if (!room || !date || !startTime || !endTime) {
//       clearErrors(`schedules.${index}.startTime`);
//       return;
//     }

//     // cek jadwal duplikat di schedules sendiri
//     const hasSameSchedule = schedules.some((sch, idx) => {
//       if (idx === index) return false;

//       const existingStart = `${sch.date} ${sch.startTime}`;
//       const existingEnd = `${sch.date} ${sch.endTime}`;

//       const newStart = `${date} ${startTime}`;
//       const newEnd = `${date} ${endTime}`;

//       return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
//     });

//     if (hasSameSchedule) {
//       setError(`schedules.${index}.startTime`, {
//         type: "manual",
//         message: "Cannot select the same time slot as another schedule",
//       });
//       hasError = true;
//       return;
//     }

//     const newStart = new Date(`${date}T${startTime}:00`);
//     const newEnd = new Date(`${date}T${endTime}:00`);

//     // cek konflik dengan booking di backend
//     const hasConflict = bookings.some((booking) => {
//       if (booking.room_id !== room) return false;

//       const bookingDateUTC = new Date(booking.date).toISOString().split("T")[0];
//       const inputDateUTC = new Date(date).toISOString().split("T")[0];

//       if (bookingDateUTC !== inputDateUTC) return false;

//       const existingStart = new Date(booking.startTime);
//       const existingEnd = new Date(booking.endTime);

//       return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
//     });

//     if (hasConflict) {
//       setError(`schedules.${index}.startTime`, {
//         type: "manual",
//         message: "The room is already booked at this time.",
//       });
//       hasError = true;
//       return;
//     }

//     clearErrors(`schedules.${index}.startTime`);
//   });

//   return hasError;
// };
