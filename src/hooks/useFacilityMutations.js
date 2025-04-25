import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useFacilityMutations(auth) {
  const queryClient = useQueryClient();

  const createFacility = useMutation({
    mutationFn: async (newFacility) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/facilities`, {
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

  const updateFacility = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/facilities/${id}`, {
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

  const deleteFacility = useMutation({
    mutationFn: async (ids) => {
      // delete many
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/facilities`, {
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
    createFacility,
    updateFacility,
    deleteFacility,
  };
}
