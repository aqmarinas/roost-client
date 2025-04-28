import { API_URL } from "@/config/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useFacilities(auth) {
  const queryClient = useQueryClient();

  const getAllFacilitiesQuery = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/facilities`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch facilities");
      }
      return data.data;
    },
  });

  const createFacilityMutation = useMutation({
    mutationFn: async (newFacility) => {
      const response = await fetch(`${API_URL}/facilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify(newFacility),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add facility");
      return result.data;
    },
    onSuccess: (newFacility) => {
      toast.success("Successfully added facility");
      queryClient.setQueryData(["facilities"], (oldData) => {
        const updated = [newFacility, ...(oldData || [])];
        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const updateFacilityMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const response = await fetch(`${API_URL}/facilities/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update facility");
      return result.data;
    },
    onSuccess: (updatedFacility) => {
      toast.success("Facility updated successfully");
      queryClient.setQueryData(["facilities"], (oldData) => {
        if (!oldData) return [updatedFacility];
        return oldData.map((facility) => (facility.id === updatedFacility.id ? updatedFacility : facility));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const deleteFacilityMutation = useMutation({
    mutationFn: async (ids) => {
      // delete many
      const response = await fetch(`${API_URL}/facilities`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ ids }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete facility");
      return result;
    },
    onSuccess: () => {
      toast.success("Facility deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete facility");
    },
  });

  return {
    ...getAllFacilitiesQuery,
    createFacilityMutation,
    updateFacilityMutation,
    deleteFacilityMutation,
  };
}
