import { Suspense, lazy, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import FacilitiesTable from "./FacilitiesTable";
import FacilitiesHeader from "./FacilitiesHeader";

const CreateModal = lazy(() => import("./modals/CreateModal"));
const UpdateModal = lazy(() => import("./modals/UpdateModal"));
const DeleteModal = lazy(() => import("./modals/DeleteModal"));

export default function Facilities() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const {
    data: facilities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_LOCAL_API}/facilities
      `)
        .then((res) => res.json())
        .then((res) => res.data),
  });

  const createFacilityMutation = useMutation({
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

  const updateFacilityMutation = useMutation({
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

  const deleteFacilityMutation = useMutation({
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
      setOpenDelete(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete facility");
    },
  });

  if (isLoading) return <p>Loading fetch facilities...</p>;
  if (error) toast.error(`Error loading facilities`);

  const handleActionClick = (facility, actionType) => {
    setSelectedFacility(facility);
    actionType === "edit" ? setOpenUpdate(true) : setOpenDelete(true);
  };

  return (
    <>
      <FacilitiesHeader onAdd={() => setOpenCreate(true)} />
      <FacilitiesTable
        data={facilities}
        onAction={handleActionClick}
      />

      <Suspense fallback={null}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createFacilityMutation.mutate(data)}
          />
        )}
        {openUpdate && (
          <UpdateModal
            facility={selectedFacility}
            isOpen={openUpdate}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateFacilityMutation.mutate({ id: selectedFacility?.id, updatedData: data })}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              deleteFacilityMutation.mutate(selectedFacility);
            }}
          />
        )}
      </Suspense>

      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm" }}
      />
    </>
  );
}
