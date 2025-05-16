import PublicLayout from "@/components/layout/PublicLayout";
import RoomDetail from "./RoomDetail";
import BookingsList from "./BookingsList";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { Home, Slash } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";

export default function DetailPage() {
  const { id } = useParams();
  const { getRoomByIdQuery } = useRooms();
  const { data: room, isLoading, error } = getRoomByIdQuery(id);

  return (
    <PublicLayout>
      {!isLoading && (
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                >
                  <Home className="size-4" />
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link
                  to="/rooms"
                  className="hover:text-gray-900"
                >
                  Rooms
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link
                  to="#"
                  className="hover:text-gray-900"
                >
                  {room.name}
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="flex flex-col lg:flex-row space-x-4 space-y-8 lg:space-y-0">
        <div className="w-full lg:w-[55%]">
          <RoomDetail
            room={room}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="w-full lg:w-[45%]">
          <div className="border rounded-lg p-4">
            <BookingsList />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
