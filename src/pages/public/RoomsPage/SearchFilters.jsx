import Input from "@/components/form/input";

export default function SearchFilters() {
  return (
    <>
      <div className="w-full rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:px-8 lg:py-6 mb-4">
        <div>
          <p className="font-semibold">When do you need a room?</p>
          <Input
            id="date"
            name="date"
            type="date"
            // {...register("date", {
            //   required: "Date is required",
            // })}
            // error={errors.date?.message}
          />
        </div>

        <div>
          <p className="font-semibold">What time?</p>
          <div className="flex gap-2">
            <Input
              id="startTime"
              name="startTime"
              type="time"
              //   {...register("startTime", {
              //     required: "Start time is required",
              //   })}
              //   error={errors.startTime?.message}
            />
            <span className="text-gray-500 flex align-center items-center">to</span>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              //   {...register("startTime", {
              //     required: "Start time is required",
              //   })}
              //   error={errors.startTime?.message}
            />
          </div>
        </div>

        <div>
          <p className="font-semibold">How many people?</p>
          <Input
            id="people"
            name="people"
            type="number"
          />
        </div>
      </div>
    </>
  );
}
