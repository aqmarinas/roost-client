import { Skeleton } from "@/components/ui/skeleton"; // Pastikan kamu memiliki komponen Skeleton dari UI library yang kamu gunakan
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

const DataTableSkeleton = ({ columnCount = 5 }) => {
  return (
    <div className="rounded-md bg-white shadow-md mt-12">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, index) => (
              <th
                key={index}
                className="py-2 px-4"
              >
                <Skeleton className="h-4" />
              </th>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell
                  key={colIndex}
                  className="py-2 px-4"
                >
                  <Skeleton className="h-6" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTableSkeleton;
