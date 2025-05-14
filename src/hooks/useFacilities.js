import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";

export function useFacilities() {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const getAllFacilitiesQuery = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const res = await axios.get("/facilities");
      return res.data.data;
    },
  });

  const createFacilityMutation = useMutation({
    mutationFn: async (newFacility) => {
      const res = await axiosPrivate.post("/facilities", newFacility);
      return res.data.data;
    },
    onSuccess: (newFacility) => {
      toast.success("Facility added successfully");
      queryClient.setQueryData(["facilities"], (oldData) => {
        const updated = [newFacility, ...(oldData || [])];
        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create facility");
    },
  });

  const updateFacilityMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosPrivate.patch(`/facilities/${id}`, updatedData);
      return res.data.data;
    },
    onSuccess: (updatedFacility) => {
      toast.success("Facility updated successfully");
      queryClient.setQueryData(["facilities"], (oldData) => {
        if (!oldData) return [updatedFacility];
        return oldData.map((facility) => (facility.id === updatedFacility.id ? updatedFacility : facility));
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update facility");
    },
  });

  const deleteFacilityMutation = useMutation({
    mutationFn: async (ids) => {
      const res = await axiosPrivate.delete("/facilities", {
        data: { ids },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Facility deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete facility");
    },
  });

  return {
    ...getAllFacilitiesQuery,
    createFacilityMutation,
    updateFacilityMutation,
    deleteFacilityMutation,
  };
}
