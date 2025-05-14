import { Controller, useForm } from "react-hook-form";
import Input from "@/components/form/input";
import OTPModal from "./OTPModal";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import Select from "@/components/form/select";
import { useRooms } from "@/hooks/useRooms";
import useAuth from "@/hooks/useAuth";
import SuccessModal from "./modals/SuccessModal";
import { AlertCircle, ArrowRight, Trash } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useOtp } from "@/hooks/useOtp";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BookModal({ isOpen, onClose }) {
  const { id } = useParams();
  const { auth } = useAuth();
  const { data: bookings = [], isLoading, error, createBookingMutation } = useBookings();
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useRooms();
  const { sendOtpMutation, verifyOtpMutation, checkIsVerified } = useOtp();

  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState(null);
  const [schedules, setSchedules] = useState([{ date: "", startTime: "", endTime: "" }]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    getValues,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      participants: "", // do not delete this
      room: "7a73c005-8cc7-4de0-8991-8a4edcf20eac",
      // todo: testing only
      // date: "2025-06-01",
      eventTitle: "ibadah amba",
      bookerName: "amba",
      bookerEmail: "rainfluenza@gmail.com",
      bookerPhone: "081234567890",
    },
  });

  const room = watch("room");

  const checkConflict = useCallback(
    (data, index) => {
      const r = data?.room ?? room;
      const d = data?.date ?? date;
      const s = data?.startTime ?? schedules[index].startTime;
      const e = data?.endTime ?? schedules[index].endTime;

      if (!r || !d || !s || !e || !schedules || !Array.isArray(schedules)) {
        clearErrors("startTime");
        return false;
      }

      // cek biar ga masukin jadwal yang sama
      const hasSameSchedule = schedules.some((schedule, idx) => {
        if (idx === index) return false;

        const { startTime, endTime, date } = schedule;

        const existingStart = `${date} ${startTime}`;
        const existingEnd = `${date} ${endTime}`;

        const newStart = `${data.date} ${data.startTime}`;
        const newEnd = `${data.date} ${data.endTime}`;

        return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
      });

      if (hasSameSchedule) {
        setError(`schedules.${index}.startTime`, {
          type: "manual",
          message: "Cannot select the same time slot as another schedule",
        });
        return true;
      }

      const newStart = new Date(`${d}T${s}:00`);
      const newEnd = new Date(`${d}T${e}:00`);

      const hasConflict = bookings.some((booking) => {
        if (booking.room_id !== r) return false;

        const bookingDateUTC = new Date(booking.date).toISOString().split("T")[0];
        const inputDateUTC = new Date(d).toISOString().split("T")[0];

        if (bookingDateUTC !== inputDateUTC) return false;

        const existingStart = new Date(booking.startTime);
        const existingEnd = new Date(booking.endTime);

        return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
      });

      if (hasConflict) {
        setError(`schedules.${index}.startTime`, {
          type: "manual",
          message: "The room is already booked at this time.",
        });
        return true;
      }

      clearErrors(`schedules.${index}.startTime`);
      return false;
    },
    [room, bookings, schedules, setError, clearErrors]
  );

  useEffect(() => {
    schedules.forEach((schedule, index) => {
      const { startTime, endTime, date } = schedule;

      // endTime must be after startTime
      if (startTime && endTime && endTime <= startTime) {
        setError(`schedules.${index}.endTime`, {
          type: "manual",
          message: "End time must be after start time",
        });
      } else {
        clearErrors(`schedules.${index}.endTime`);
      }

      // check for conflicts
      if (room && date && startTime && endTime) {
        checkConflict({ date, startTime, endTime, room }, index);
      }
    });
  }, [schedules, room, checkConflict]);

  // onSubmit
  const createBooking = async (data) => {
    const result = await createBookingMutation.mutateAsync({ newBooking: data, auth });

    if (result) {
      // success modal
      if (!auth?.accessToken) {
        setSuccessData(result);
        setStep(3);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    // validate lagi karena RHF delete setError
    const values = getValues();
    let hasError = false;

    values.schedules.forEach((schedule, index) => {
      const { startTime, endTime } = schedule;

      if (startTime && endTime && endTime <= startTime) {
        setError(`schedules.${index}.endTime`, {
          type: "manual",
          message: "End time must be after start time",
        });
        hasError = true;
      } else {
        clearErrors(`schedules.${index}.endTime`);
      }

      const conflict = checkConflict({ ...schedule, room: values.room }, index);
      if (conflict) hasError = true;
    });

    if (hasError) return;

    if (auth?.accessToken) {
      await createBooking(data);
      handleModalClose();
    } else {
      const isVerified = await checkIsVerified(data.bookerEmail);
      if (isVerified) {
        // skip OTP
        await createBooking(data);
        setStep(3);
      } else {
        await handleOtpSend();
        setStep(2);
      }
    }
  };

  const handleOtpSend = async () => {
    const { bookerEmail, bookerName } = getValues();
    await sendOtpMutation.mutateAsync({ bookerEmail, bookerName });
  };

  const handleOtpVerify = async (otp) => {
    const { bookerEmail } = getValues();
    await verifyOtpMutation.mutateAsync({ bookerEmail, otp });

    const data = getValues();
    await createBooking(data);
  };

  // delay close
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setStep(1);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // set default value room
  useEffect(() => {
    if (id) {
      setValue("room", id);
    }
  }, [id, setValue]);

  const handleModalClose = () => {
    reset();
    setStep(1);
    setSuccessData(null);
    onClose();
  };

  const addSchedule = () => {
    if (schedules.length >= 3) return; // max 3
    setSchedules([...schedules, { date: "", startTime: "", endTime: "" }]);
  };

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const removeSchedule = (indexToRemove) => {
    setSchedules((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={`${auth?.accessToken ? "Create Booking" : ""}`}
      >
        {/* indicators */}
        {!auth?.accessToken && (
          <div className="sticky top-0 z-10 bg-white mt-0.5">
            <div className="mx-auto grid grid-cols-2">
              {[1, 2].includes(step) &&
                [1, 2].map((s) => (
                  <div
                    key={s}
                    className="flex flex-col items-center space-y-2 rounded-lg"
                  >
                    <div
                      className={`flex size-6 items-center justify-center rounded-full text-white text-sm font-semibold 
        ${step === s ? "bg-indigo-600" : "bg-gray-300"}`}
                    >
                      {s}
                    </div>
                    <h3 className={`text-sm font-semibold ${step === s ? "text-indigo-600" : "text-gray-500"}`}>{s === 1 ? "Create Room" : "Verify OTP"}</h3>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* step */}
        <div className="overflow-hidden">
          <div
            className={`${!auth?.accessToken ? "flex w-[200%] transition-transform duration-500 ease-in-out" : ""}`}
            style={{
              transform: !auth?.accessToken ? `translateX(${step === 1 ? "0%" : "-50%"})` : undefined,
            }}
          >
            {/* step 1 */}
            <div className="w-full">
              {!auth?.accessToken && (
                <Alert className="my-2 border-indigo-200 bg-indigo-50">
                  <AlertCircle className="size-4 text-indigo-700" />
                  <AlertDescription className="text-indigo-700">You do not need to verify OTP if you have made a booking within the last 30 minutes.</AlertDescription>
                </Alert>
              )}
              {step === 1 && (
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Input
                    id="eventTitle"
                    label="Title"
                    placeholder="Weekly Meeting (Project X)"
                    {...register("eventTitle", {
                      required: "Title is required",
                      minLength: {
                        value: 5,
                        message: "Title must be at least 5 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z0-9À-ÿ.,()\-_'"/# ]+$/,
                        message: "Title contains invalid characters",
                      },
                    })}
                    error={errors.eventTitle?.message}
                    required
                  />
                  <Input
                    id="bookerName"
                    label="Booker Name"
                    placeholder="John Doe"
                    {...register("bookerName", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                      pattern: {
                        value: /^[A-Za-zÀ-ÿ.'\-() ]+$/,
                        message: "Name contains invalid characters",
                      },
                    })}
                    error={errors.bookerName?.message}
                    required
                  />
                  <Input
                    id="bookerEmail"
                    label="Booker Email"
                    type="email"
                    placeholder="johndoe@xyz.co.id"
                    {...register("bookerEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={errors.bookerEmail?.message}
                    required
                  />
                  <p className="px-1 text-sm text-gray-500">Use your company email (@xyz.co.id)</p>
                  <Input
                    id="bookerPhone"
                    label="Booker WhatsApp Number"
                    placeholder="0812345678910"
                    type="tel"
                    minLength={8}
                    maxLength={15}
                    {...register("bookerPhone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(628|08)[0-9]{8,13}$/,
                        message: "Phone number must start with '628' or '08' and contain 10 to 15 digits",
                      },
                    })}
                    error={errors.bookerPhone?.message}
                    required
                  />

                  {/* participants  */}
                  <div className="mt-2 flex items-center gap-2 mx-1">
                    <Checkbox
                      onCheckedChange={() => {
                        setIsChecked((prev) => !prev);
                      }}
                    />
                    <p className="text-sm text-gray-500">Book for someone else?</p>
                  </div>

                  {isChecked && (
                    <Input
                      id="participants"
                      label="Participants (Optional)"
                      placeholder="Head of X"
                      {...register("participants")}
                      error={errors.participants?.message}
                    />
                  )}

                  <Controller
                    name="room"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "Room is required" }}
                    render={({ field }) => (
                      <Select
                        label="Room"
                        options={rooms}
                        selected={field.value}
                        onChange={field.onChange}
                        error={errors.room}
                        fetchError={roomsError}
                        loading={roomsLoading}
                        displayKey="name"
                        valueKey="id"
                        required
                      />
                    )}
                  />

                  {schedules.map((_, index) => (
                    <div
                      key={index}
                      className="relative border p-2 rounded-md mt-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold">Schedule {index + 1}</p>
                        {schedules.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeSchedule(index)}
                          >
                            <Trash className="size-4 text-indigo-700" />
                          </Button>
                        )}
                      </div>
                      <Input
                        id={`schedules.${index}.date`}
                        label="Date"
                        type="date"
                        min="1950-01-01"
                        max="2099-12-31"
                        {...register(`schedules.${index}.date`, {
                          required: "Date is required",
                          validate: (value) => {
                            const selected = new Date(value);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return selected >= today || "Date cannot be in the past";
                          },
                        })}
                        error={errors?.schedules?.[index]?.date?.message}
                        required
                        onChange={(e) => updateSchedule(index, "date", e.target.value)}
                      />

                      {/* time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            id={`schedules.${index}.startTime`}
                            label="Start Time"
                            type="time"
                            {...register(`schedules.${index}.startTime`, {
                              required: "Start time is required",
                            })}
                            error={errors?.schedules?.[index]?.startTime?.message}
                            required
                            onChange={(e) => updateSchedule(index, "startTime", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            id={`schedules.${index}.endTime`}
                            label="End Time"
                            type="time"
                            {...register(`schedules.${index}.endTime`, {
                              required: "End time is required",
                            })}
                            error={errors?.schedules?.[index]?.endTime?.message}
                            required
                            onChange={(e) => updateSchedule(index, "endTime", e.target.value)}
                          />
                        </div>
                        {isLoading && <p className="text-sm text-gray-500">Loading booking data...</p>}
                        {error && <p className="text-sm text-red-500">Failed to check availability of bookings</p>}
                      </div>
                    </div>
                  ))}

                  {schedules.length < 3 && (
                    <Button
                      type="button"
                      fullWidth
                      onClick={addSchedule}
                      variant="outline"
                      className="my-2 text-indigo-700"
                    >
                      + Add Another Schedule
                    </Button>
                  )}

                  {schedules.length >= 3 && <p className="text-sm mt-2 text-gray-500 text-center">Maximum 3 schedules allowed</p>}

                  <Input
                    id="notes"
                    label="Notes (Optional)"
                    placeholder="Notes"
                    {...register("notes")}
                    error={errors.notes?.message}
                  />

                  <Button
                    fullWidth
                    className="mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Book Room"}
                    <ArrowRight className="size-4 text-white" />
                  </Button>
                </form>
              )}
            </div>

            {/* step 2 */}
            {!auth?.accessToken && (
              <div className="w-full">
                {step === 2 && (
                  <div className="transition-transform duration-300">
                    <OTPModal
                      onSubmit={handleOtpVerify}
                      onResend={handleOtpSend}
                    />
                  </div>
                )}
                {/* success modal */}
                {step === 3 && (
                  <SuccessModal
                    data={successData}
                    onClose={handleModalClose}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
