import { Suspense, lazy, useState } from "react";
import useAuth from "@/hooks/useAuth";
import FacilitiesTable from "./table/FacilitiesTable";
import FacilitiesHeader from "./FacilitiesHeader";
import { useFacilities } from "@/hooks/useFacilities";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

const CreateModal = lazy(() => import("./modals/CreateFacility"));
const UpdateModal = lazy(() => import("./modals/UpdateFacility"));
const DeleteModal = lazy(() => import("./modals/DeleteFacility"));

export default function Facilities() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const { auth } = useAuth();
  const { data: facilities = [], isLoading, error, createFacilityMutation, updateFacilityMutation, deleteFacilityMutation } = useFacilities(auth);

  const handleActionClick = (facility, actionType) => {
    setSelectedFacility(facility);
    actionType === "edit" ? setOpenUpdate(true) : setOpenDelete(true);
  };

  return (
    <>
      <FacilitiesHeader
        isLoading={isLoading}
        onAdd={() => setOpenCreate(true)}
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={2} />
      ) : error ? (
        <p className="py-4 text-red-500 text-sm">Error: Cannot get facilities data</p>
      ) : (
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
            onCreate={(data) => createFacilityMutation.mutateAsync(data)}
          />
        )}
        {openUpdate && (
          <UpdateModal
            facility={selectedFacility}
            isOpen={openUpdate}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateFacilityMutation.mutateAsync({ id: selectedFacility?.id, updatedData: data })}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              deleteFacilityMutation.mutateAsync(Array.isArray(selectedFacility) ? selectedFacility : [selectedFacility?.id]);
            }}
          />
        )}
      </Suspense>
    </>
  );
}
