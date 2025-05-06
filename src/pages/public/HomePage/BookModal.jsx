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
import { ArrowRight } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";

export default function BookModal({ isOpen, onClose }) {
  const { data: bookings = [], isLoading, error, createBookingMutation } = useBookings();
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useRooms();
  const { auth } = useAuth();

  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      // date: "2025-05-03",
      startTime: "00:00",
      endTime: "01:00",
      // todo: testing only
      room: "7a73c005-8cc7-4de0-8991-8a4edcf20eac",
      eventTitle: "ibadah amba",
      bookerName: "amba",
      bookerEmail: "amba@gmail.com",
      bookerPhone: "081234567890",
    },
  });

  const room = watch("room");
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const checkConflict = useCallback(
    (data) => {
      const r = data?.room ?? room;
      const d = data?.date ?? date;
      const s = data?.startTime ?? startTime;
      const e = data?.endTime ?? endTime;

      if (!r || !d || !s || !e || !bookings || !Array.isArray(bookings)) {
        clearErrors("startTime");
        return false;
      }

      const newStart = new Date(`${date}T${startTime}:00`);
      const newEnd = new Date(`${date}T${endTime}:00`);

      const hasConflict = bookings.some((booking) => {
        if (booking.room_id !== room) return false;
        // if (booking.date !== date) return false; // beda tz

        const inputDateUTC = new Date(date);
        const bookingDateUTC = new Date(booking.date);
        if (inputDateUTC.toISOString().split("T")[0] !== bookingDateUTC.toISOString().split("T")[0]) return false;

        const existingStart = new Date(booking.startTime);
        const existingEnd = new Date(booking.endTime);

        return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
      });

      if (hasConflict) {
        console.log("CONFLICT");
        setError("startTime", {
          type: "manual",
          message: "Room already booked.",
        });
        return true;
      } else {
        clearErrors("startTime");
        return false;
      }
    },
    [room, date, startTime, endTime, bookings]
  );

  // time validation
  useEffect(() => {
    if (startTime && endTime && endTime <= startTime) {
      setError("endTime", {
        type: "manual",
        message: "End time must be after start time",
      });
    }
    return;
  }, [startTime, endTime]);

  // trigger check conflict
  useEffect(() => {
    if (room && date && startTime && endTime && startTime !== "" && endTime !== "") {
      checkConflict();
    }
  }, [room, date, startTime, endTime, checkConflict]);

  const onSubmit = async (data) => {
    const result = await createBookingMutation.mutateAsync(data);
    if (result) {
      if (!auth?.accessToken) {
        setSuccessData(result);
        setStep(3);
      }
      return;
    }
  };

  const handleModalClose = () => {
    reset();
    setStep(1);
    setSuccessData(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      // delay reset
      const timeout = setTimeout(() => {
        setStep(1);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

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
              {step === 1 && (
                <form
                  onSubmit={handleSubmit((data) => {
                    const conflict = checkConflict(data);
                    if (conflict) {
                      setError("startTime", { type: "manual", message: "Room already booked." });
                      return;
                    }
                    if (auth?.accessToken) {
                      onSubmit(data);
                    } else {
                      setStep(2);
                    }
                  })}
                >
                  {" "}
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
                    label="Name"
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
                    label="Email"
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
                  <p className="px-1 text-sm text-gray-500 ">Use your company email (@xyz.co.id)</p>
                  <Input
                    id="bookerPhone"
                    label="Phone Number"
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
                  <Input
                    id="date"
                    label="Date"
                    type="date"
                    min="1950-01-01"
                    max="2099-12-31"
                    {...register("date", {
                      required: "Date is required",
                      validate: (value) => {
                        const selected = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return selected >= today || "Date cannot be in the past";
                      },
                    })}
                    error={errors.date?.message}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        id="startTime"
                        label="Start Time"
                        type="time"
                        {...register("startTime", {
                          required: "Start time is required",
                        })}
                        error={errors.startTime?.message}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        id="endTime"
                        label="End Time"
                        type="time"
                        {...register("endTime", {
                          required: "End time is required",
                        })}
                        error={errors.endTime?.message}
                        required
                      />
                    </div>
                    {isLoading && <p className="text-sm text-gray-500">Loading booking data...</p>}
                    {error && <p className="text-sm text-red-500">Failed to check availability of bookings</p>}
                  </div>
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

            {/* 2 */}
            {!auth?.accessToken && (
              <div className="w-full">
                {step === 2 && (
                  <div className="transition-transform duration-300">
                    <OTPModal
                      onSubmit={async (otp) => {
                        // const isValid = await validateOTP(otp);
                        // if (isValid) {
                        const data = getValues();
                        await onSubmit(data);

                        // } else {
                        // tampilkan error
                        // }
                      }}
                    />
                  </div>
                )}
                {step === 3 && (
                  <SuccessModal
                    data={successData}
                    onClose={() => {
                      handleModalClose();
                    }}
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
