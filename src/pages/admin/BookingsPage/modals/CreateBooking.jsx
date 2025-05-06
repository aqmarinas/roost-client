// import { Controller, useForm } from "react-hook-form";
// import Input from "@/components/form/input";
// import Modal from "@/components/ui/Modal";
// import { Button } from "@/components/ui/button";
// import { useCallback, useEffect, useState } from "react";
// import Select from "@/components/form/select";
// import { useRooms } from "@/hooks/useRooms";

// export default function CreateBooking({ isOpen, onClose, onCreate, existBooking }) {
//   const { data: rooms, error: roomsError } = useRooms();

//   // handleSubmit from RHF deleted setError
//   const [manualErrors, setManualErrors] = useState({
//     startTime: "",
//     endTime: "",
//   });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     control,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     shouldFocusError: true,
//     mode: "onChange",
//     defaultValues: {
//       // date: "2025-05-03",
//       // startTime: "00:00",
//       // endTime: "01:00",
//       // todo: testing only
//       room: "7a73c005-8cc7-4de0-8991-8a4edcf20eac",
//       eventTitle: "ibadah amba",
//       bookerName: "amba",
//       bookerEmail: "amba@gmail.com",
//       bookerPhone: "081234567890",
//     },
//   });

//   const room = watch("room");
//   const date = watch("date");
//   const startTime = watch("startTime");
//   const endTime = watch("endTime");

//   const checkConflict = useCallback(() => {
//     if (!room || !date || !startTime || !endTime || !existBooking || !Array.isArray(existBooking)) return;

//     const newStart = new Date(`${date}T${startTime}:00`);
//     const newEnd = new Date(`${date}T${endTime}:00`);

//     const hasConflict = existBooking.some((booking) => {
//       if (booking.room_id !== room) return false;
//       // if (booking.date !== date) return false; // beda tz

//       const inputDateUTC = new Date(date);
//       const bookingDateUTC = new Date(booking.date);
//       if (inputDateUTC.toISOString().split("T")[0] !== bookingDateUTC.toISOString().split("T")[0]) return false;

//       const existingStart = new Date(booking.startTime);
//       const existingEnd = new Date(booking.endTime);

//       return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
//     });

//     if (hasConflict) {
//       console.log("CONFLICT");
//       setManualErrors((prevErrors) => ({
//         ...prevErrors,
//         startTime: "Room already booked.",
//       }));
//     } else if (!hasConflict && manualErrors.startTime) {
//       setManualErrors((prevErrors) => ({
//         ...prevErrors,
//         startTime: "",
//       }));
//     }
//   }, [room, date, startTime, endTime, existBooking]);

//   useEffect(() => {
//     console.log("triggered for startTime or endTime validation");

//     if (startTime && endTime && endTime <= startTime) {
//       setManualErrors((prevErrors) => ({
//         ...prevErrors,
//         endTime: "End time must be after start time",
//       }));
//     } else if (endTime && startTime && endTime > startTime && manualErrors.endTime) {
//       setManualErrors((prevErrors) => ({
//         ...prevErrors,
//         endTime: "",
//       }));
//     }
//   }, [startTime, endTime]);

//   useEffect(() => {
//     console.log("triggered for conflict check");

//     if (room && date && startTime && endTime && startTime !== "" && endTime !== "") {
//       checkConflict();
//     }
//   }, [room, date, startTime, endTime, checkConflict]);

//   const onSubmit = async (data) => {
//     if (manualErrors.startTime || manualErrors.endTime) return;
//     await onCreate(data);
// handleModalClose();
//   };

//   const handleModalClose = () => {
//     reset();
//     onClose();
//   };

//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onClose={handleModalClose}
//         title="Book a Room"
//       >
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Input
//             id="eventTitle"
//             label="Title"
//             placeholder="Weekly Meeting (Project X)"
//             {...register("eventTitle", {
//               required: "Title is required",
//               minLength: {
//                 value: 5,
//                 message: "Title must be at least 5 characters",
//               },
//               pattern: {
//                 value: /^[A-Za-z0-9À-ÿ.,()\-_'"/# ]+$/,
//                 message: "Title contains invalid characters",
//               },
//             })}
//             error={errors.eventTitle?.message}
//             required
//           />

//           <Input
//             id="bookerName"
//             label="Name"
//             placeholder="John Doe"
//             {...register("bookerName", {
//               required: "Name is required",
//               minLength: {
//                 value: 3,
//                 message: "Name must be at least 3 characters",
//               },
//               pattern: {
//                 value: /^[A-Za-zÀ-ÿ.'\-() ]+$/,
//                 message: "Name contains invalid characters",
//               },
//             })}
//             error={errors.bookerName?.message}
//             required
//           />

//           <Input
//             id="bookerEmail"
//             label="Email"
//             type="email"
//             placeholder="johndoe@xyz.co.id"
//             {...register("bookerEmail", {
//               required: "Email is required",
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: "Invalid email address",
//               },
//             })}
//             error={errors.bookerEmail?.message}
//             required
//           />
//           <p className="px-1 text-sm text-gray-500 ">Use your company email (@xyz.co.id)</p>

//           <Input
//             id="bookerPhone"
//             label="Phone Number"
//             placeholder="0812345678910"
//             type="tel"
//             minLength={8}
//             maxLength={15}
//             {...register("bookerPhone", {
//               required: "Phone number is required",
//               pattern: {
//                 value: /^(628|08)[0-9]{8,13}$/,
//                 message: "Phone number must start with '628' or '08' and contain 10 to 15 digits",
//               },
//             })}
//             error={errors.bookerPhone?.message}
//             required
//           />

//           <Controller
//             name="room"
//             control={control}
//             defaultValue={null}
//             rules={{ required: "Room is required" }}
//             render={({ field }) => (
//               <Select
//                 label="Room"
//                 options={rooms}
//                 selected={field.value}
//                 onChange={field.onChange}
//                 error={errors.room}
//                 fetchError={roomsError}
//                 displayKey="name"
//                 valueKey="id"
//                 required
//               />
//             )}
//           />

//           <Input
//             id="date"
//             label="Date"
//             type="date"
//             min="1950-01-01"
//             max="2099-12-31"
//             {...register("date", {
//               required: "Date is required",
//               validate: (value) => {
//                 const selected = new Date(value);
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);
//                 return selected >= today || "Date cannot be in the past";
//               },
//             })}
//             error={errors.date?.message}
//             required
//           />

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Input
//                 id="startTime"
//                 label="Start Time"
//                 type="time"
//                 {...register("startTime", {
//                   required: "Start time is required",
//                 })}
//                 error={manualErrors.startTime || errors.startTime?.message}
//                 required
//               />
//             </div>
//             <div>
//               <Input
//                 id="endTime"
//                 label="End Time"
//                 type="time"
//                 {...register("endTime", {
//                   required: "End time is required",
//                   // validate: (end) => {
//                   //   const start = watch("startTime");
//                   //   if (start && end <= start) {
//                   //     return "End time must be after start time";
//                   //   }
//                   //   return true;
//                   // },
//                 })}
//                 error={manualErrors.endTime || errors.endTime?.message}
//                 required
//               />
//             </div>
//           </div>

//           <Button
//             fullWidth
//             className="mt-4"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Booking..." : "Book Room"}
//           </Button>
//         </form>
//       </Modal>
//     </>
//   );
// }
