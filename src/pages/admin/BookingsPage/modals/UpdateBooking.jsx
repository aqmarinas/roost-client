import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { useCallback, useEffect } from "react";
import Select from "@/components/form/select";
import { useRooms } from "@/hooks/useRooms";

export default function UpdateModal({ isOpen, onClose, booking, onSuccess, existBooking }) {
  // for select
  const { data: rooms, error: roomsError } = useRooms();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (booking && isOpen) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      };

      const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toTimeString().substring(0, 5); // HH:MM
      };

      setValue("eventTitle", booking.eventTitle);
      setValue("room", booking.room.id);
      setValue("date", formatDate(booking.date));
      setValue("startTime", formatTime(booking.startTime));
      setValue("endTime", formatTime(booking.endTime));
      setValue("bookerName", booking.bookerName);
      setValue("bookerEmail", booking.bookerEmail);
      setValue("bookerPhone", booking.bookerPhone);
    }
  }, [booking, isOpen, setValue]);

  const room = watch("room");
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const checkConflict = useCallback(() => {
    if (!room || !date || !startTime || !endTime || !existBooking || !Array.isArray(existBooking)) {
      clearErrors("startTime");
      return;
    }

    const newStart = new Date(`${date}T${startTime}:00`);
    const newEnd = new Date(`${date}T${endTime}:00`);

    const hasConflict = existBooking.some((b) => {
      if (b.id === booking?.id) return false;
      if (b.room_id !== room) return false;

      const inputDateUTC = new Date(date);
      const bookingDateUTC = new Date(b.date);
      if (inputDateUTC.toISOString().split("T")[0] !== bookingDateUTC.toISOString().split("T")[0]) return false;

      const existingStart = new Date(b.startTime);
      const existingEnd = new Date(b.endTime);

      return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
    });

    if (hasConflict) {
      setError("startTime", {
        type: "manual",
        message: "Room already booked.",
      });
    } else {
      clearErrors("startTime");
    }
  }, [room, date, startTime, endTime, existBooking, setError, clearErrors]);

  useEffect(() => {
    console.log("fields changed");
    if (startTime && endTime && endTime <= startTime) {
      setError("endTime", {
        type: "manual",
        message: "End time must be after start time",
      });
    } else {
      clearErrors("endTime");
    }

    if (room && date && startTime && endTime && startTime !== "" && endTime !== "") {
      checkConflict();
    }
  }, [room, date, startTime, endTime, checkConflict, setError, clearErrors]);

  const onSubmit = async (data) => {
    const formatters = {
      date: (value) => value.split("T")[0],
      startTime: (value) => new Date(value).toTimeString().substring(0, 5),
      endTime: (value) => new Date(value).toTimeString().substring(0, 5),
    };

    const updatedFields = Object.keys(data).reduce((acc, key) => {
      if (key === "room") {
        if (data[key] !== booking[key]?.id) {
          acc[key] = data[key];
        }
      } else if (formatters[key]) {
        if (data[key] !== formatters[key](booking[key])) {
          acc[key] = data[key];
        }
      } else {
        if (data[key] !== booking[key]) {
          acc[key] = data[key];
        }
      }
      return acc;
    }, {});

    await onSuccess(updatedFields);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Booking"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="eventTitle"
          label="Title"
          type="text"
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
          autofocus
        />

        <Input
          id="bookerName"
          name="bookerName"
          type="text"
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
          min="1900-01-01"
          max="2099-12-31"
          {...register("date", {
            required: "Date is required",
            // validate: (value) => {
            //   const selected = new Date(value);
            //   const today = new Date();
            //   today.setHours(0, 0, 0, 0);
            //   return selected >= today || "Date cannot be in the past";
            // },
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
        </div>

        <Button
          fullWidth
          className="mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
}
