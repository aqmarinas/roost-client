import { useForm } from "react-hook-form";
import Input from "../../../components/atom/Input";
import OTPModal from "./OTPModal";
import Modal from "../../../components/ui/Modal";
import { ChevronDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/config";
import { useEffect } from "react";

export default function BookModal({ isOpen, onClose, onCreate, existBooking }) {
  // for select
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    error: roomsError,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () =>
      fetch(`${API_URL}/rooms
      `)
        .then((res) => res.json())
        .then((res) => res.data || []),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const date = watch("date");
  const startTime = watch("startTime");

  const onSubmit = async (data) => {
    await onCreate(data);
    reset();
    onClose(); // di public harusnya ga langsung close (otp dulu)
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const handlePhoneNumberChange = (e) => {
    const phoneValue = e.target.value;
    const phoneRegex = /^(628|08)[0-9]{8,13}$/;

    if (!phoneRegex.test(phoneValue)) {
      setError("bookerPhone", {
        type: "manual",
        message: "Phone number must start with '628' or '08' and contain 8 to 15 digits",
      });
    } else {
      clearErrors("bookerPhone");
    }
  };

  const handleDateAndTimeChange = () => {
    if (date && startTime) {
      const selectedDateTime = new Date(`${date}T${startTime}`);
      const conflict = existBooking.some((booking) => {
        const existingStart = new Date(`${booking.date}T${booking.startTime}`);
        const existingEnd = new Date(`${booking.date}T${booking.endTime}`);

        return (selectedDateTime >= existingStart && selectedDateTime < existingEnd) || (new Date(`${date}T${startTime}`) < existingEnd && new Date(`${date}T${startTime}`) >= existingStart);
      });

      if (conflict) {
        setError("date", {
          type: "manual",
          message: "The selected date and time overlap with an existing booking.",
        });
      } else {
        clearErrors("date");
      }
    }
  };

  useEffect(() => {
    handleDateAndTimeChange();
  }, [date, startTime]);

  return (
    <>
      <Modal
        isOpen={isOpen}
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
            autofocus
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
            placeholder="0812345678910"
            type="tel"
            minLength={8}
            maxLength={15}
            {...register("bookerPhone", {
              required: "Phone number is required",
            })}
            error={errors.bookerPhone?.message}
            onChange={handlePhoneNumberChange}
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
            variant="default"
            fullWidth
            className="mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Book Room"}
          </Button>
        </form>
      </Modal>

      {/* <OTPModal
          isOpen={isModalOTPOpen}
          onClose={() => {
            setIsModalOTPOpen(false);
            handleModalClose();
          }}
        /> */}
    </>
  );
}
