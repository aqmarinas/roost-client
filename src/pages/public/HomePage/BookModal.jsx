"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "../../../components/atom/Input";
import Button from "../../../components/atom/Button";
import OTPModal from "./OTPModal";
import Modal from "../../../components/ui/Modal";
import useFetch from "../../../hooks/useFetch";
import { ChevronDownIcon } from "lucide-react";

export default function BookModal({ open, onClose, onSuccess }) {
  // const [isModalOTPOpen, setIsModalOTPOpen] = useState(false);
  const { data: response, loading: roomsLoading, error: roomsError } = useFetch(`/rooms`);
  const rooms = response?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book room");
      }

      toast.success("Room booked successfully!");
      // setIsModalOTPOpen(true);
      // onSuccess?.();
      reset();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to book room");
    }
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        title="Book a Room"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="eventTitle"
            label="Title"
            placeholder="Weekly Meeting (Project X)"
            {...register("eventTitle", {
              required: "Title is required",
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
                value: 2,
                message: "Name must be at least 2 characters",
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
              // validate: (value) => value.endsWith("@xyz.co.id") || "Must use company email (@xyz.co.id)",
            })}
            error={errors.bookerEmail?.message}
            required
          />
          <p className="text-sm text-gray-500 ">Use your company email (@xyz.co.id)</p>

          <Input
            id="bookerPhone"
            label="Phone Number"
            placeholder="62812345678"
            {...register("bookerPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^62[0-9]{8,13}$/,
                message: "Invalid phone number format",
              },
            })}
            error={errors.bookerPhone?.message}
            required
          />

          {/* Room Select */}
          <div>
            <label
              htmlFor="room"
              className="block text-sm/6 font-semibold text-gray-900 mt-3"
            >
              Room <span className="text-red-500"> *</span>
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="room"
                name="room"
                defaultValue=""
                {...register("room", {
                  required: "Room selection is required",
                })}
                disabled={roomsLoading || roomsError}
                className={`col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 ${
                  errors.room ? "outline-red-500" : "outline-gray-300"
                }  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
              >
                <option
                  value=""
                  disabled
                  className="text-gray-500"
                >
                  {roomsLoading ? "Loading rooms..." : roomsError ? "Error loading rooms" : "Select a room"}
                </option>
                {rooms?.length > 0 ? (
                  rooms?.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.name}
                    </option>
                  ))
                ) : (
                  <option
                    value=""
                    disabled
                  >
                    No rooms available
                  </option>
                )}
              </select>
              {errors.room && <p className="text-red-500 text-sm">{errors.room.message}</p>}
              {roomsError && <p className="text-red-500 text-sm">Failed to load rooms</p>}
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </div>

          <Input
            id="date"
            label="Date"
            type="date"
            min="1950-01-01"
            max="2099-12-31"
            {...register("date", {
              required: "Date is required",
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || "Date cannot be in the past";
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
                  validate: (value, { startTime }) => value > startTime || "End time must be after start time",
                })}
                error={errors.endTime?.message}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full justify-center mt-4"
          >
            {isSubmitting ? "Booking..." : "Book Room"}
          </Button>
        </form>
      </Modal>

      {/* <OTPModal
          open={isModalOTPOpen}
          onClose={() => {
            setIsModalOTPOpen(false);
            handleModalClose();
          }}
        /> */}
    </>
  );
}
