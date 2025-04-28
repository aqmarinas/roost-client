import { API_URL } from "@/config/config";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

export function FacilitySelect({ setValue, watch, error, register, required }) {
  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/facilities`);
      const json = await res.json();
      return json.data || [];
    },
  });

  const watchedFacilities = watch("facilities") || [];

  const selectedFacilities = facilities.filter((f) => watchedFacilities.includes(f.id));

  const handleFacilityChange = (e) => {
    const facilityId = e.target.value;
    if (facilityId && !watchedFacilities.includes(facilityId)) {
      const updated = [...watchedFacilities, facilityId];
      setValue("facilities", updated);
    }
    e.target.value = "";
  };

  const handleRemoveFacility = (facilityId) => {
    const updated = watchedFacilities.filter((id) => id !== facilityId);
    setValue("facilities", updated);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm/6 font-semibold text-gray-900 mt-3">
        Facilities
        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        {...register}
        onChange={handleFacilityChange}
        className={`block w-full border rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${error ? "border-red-500" : "border-gray-300"}`}
        defaultValue=""
      >
        <option
          value=""
          disabled
        >
          {isLoading ? "Loading facilities..." : "Select facilities"}
        </option>
        {facilities.map((facility) => (
          <option
            key={facility.id}
            value={facility.id}
          >
            {facility.name}
          </option>
        ))}
      </select>

      {selectedFacilities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedFacilities.map((facility) => (
            <div
              key={facility.id}
              className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
            >
              {facility.name}
              <div
                onClick={() => handleRemoveFacility(facility.id)}
                className="ml-2 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
