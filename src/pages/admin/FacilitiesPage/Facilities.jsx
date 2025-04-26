import { Suspense, lazy, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import FacilitiesTable from "./FacilitiesTable";
import FacilitiesHeader from "./FacilitiesHeader";
import { useFacilityMutations } from "@/hooks/useFacilityMutations";

const CreateModal = lazy(() => import("./modals/CreateModal"));
const UpdateModal = lazy(() => import("./modals/UpdateModal"));
const DeleteModal = lazy(() => import("./modals/DeleteModal"));

export default function Facilities() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const { auth } = useAuth();
  const { createFacility, updateFacility, deleteFacility } = useFacilityMutations(auth);

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

  const handleActionClick = (facility, actionType) => {
    setSelectedFacility(facility);
    actionType === "edit" ? setOpenUpdate(true) : setOpenDelete(true);
  };

  return (
    <>
      <FacilitiesHeader onAdd={() => setOpenCreate(true)} />

      {isLoading && <p className="px-4 text-gray-500">Load facilities data...</p>}
      {error && <p className="px-4 text-red-500">Error: Cannot get facilities data</p>}

      {!isLoading && !error && (
        <FacilitiesTable
          data={facilities}
          onAction={handleActionClick}
        />
      )}

      <Suspense fallback={null}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createFacility.mutateAsync(data).then(() => setOpenCreate(false))}
          />
        )}
        {openUpdate && (
          <UpdateModal
            facility={selectedFacility}
            isOpen={openUpdate}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateFacility.mutateAsync({ id: selectedFacility?.id, updatedData: data }).then(() => setOpenUpdate(false))}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              deleteFacility.mutateAsync(Array.isArray(selectedFacility) ? selectedFacility : [selectedFacility?.id]).then(() => setOpenDelete(false));
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
