// FacilitySelect.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function FacilitySelect({ setValue, watch, error }) {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const watchedFacilities = watch("facilities") || [];

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("http://localhost:3000/facilities");
        if (!response.ok) {
          throw new Error("Failed to fetch facilities");
        }
        const responseData = await response.json();

        const facilitiesData = responseData.data || responseData;

        if (Array.isArray(facilitiesData)) {
          setFacilities(facilitiesData);
        } else {
          console.error("Unexpected facilities data format:", facilitiesData);
          setFacilities([]);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
        setFacilities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    if (facilities.length > 0 && watchedFacilities.length > 0) {
      const preSelected = facilities.filter((f) => watchedFacilities.includes(f.id));
      setSelectedFacilities(preSelected);
    }
  }, [facilities, watchedFacilities]);

  const handleFacilityChange = (e) => {
    const facilityId = e.target.value;

    if (facilityId && !watchedFacilities.includes(facilityId)) {
      const facility = facilities.find((f) => f.id === facilityId);

      if (facility) {
        const newSelectedFacilities = [...watchedFacilities, facilityId];
        setValue("facilities", newSelectedFacilities);
        setSelectedFacilities([...selectedFacilities, facility]);
      }
    }

    // Reset the select to the default option
    e.target.value = "";
  };

  const handleRemoveFacility = (facilityId) => {
    const updatedFacilities = watchedFacilities.filter((id) => id !== facilityId);
    setValue("facilities", updatedFacilities);
    setSelectedFacilities(selectedFacilities.filter((f) => f.id !== facilityId));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm/6 font-semibold text-gray-900 mt-3">
        Facilities <span className="text-red-500"> *</span>
      </label>

      <select
        onChange={handleFacilityChange}
        className={`block w-full border rounded-md p-2  text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${error ? "border-red-500" : "border-gray-300"} placeholder:text-gray-300`}
        defaultValue=""
      >
        <option
          value=""
          disabled
        >
          {isLoading ? "Loading facilities..." : "Select facilities"}
        </option>
        {Array.isArray(facilities) &&
          facilities.map((facility) => (
            <option
              key={facility.id}
              value={facility.id}
            >
              {facility.name}
            </option>
          ))}
      </select>

      {/* Selected facilities list */}
      {selectedFacilities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedFacilities.map((facility) => (
            <div
              key={facility.id}
              className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
            >
              {facility.name}
              <button
                type="button"
                onClick={() => handleRemoveFacility(facility.id)}
                className="ml-2 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
