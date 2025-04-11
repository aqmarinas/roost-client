import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange, className }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      let start = currentPage - leftOffset;
      let end = currentPage + leftOffset;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showLeftEllipsis = currentPage > 3 && totalPages > 5;
  const showRightEllipsis = currentPage < totalPages - 2 && totalPages > 5;

  return (
    <div className={`flex items-center justify-between border-t border-gray-200 `}>
      {/* Mobile version */}
      <div className="flex flex-1 justify-between sm:hidden mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-300 hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop version */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span>{" "}
            results
          </p>
          |
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="rounded-md border border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {[5, 10, 20, 50].map((num) => (
                <option
                  key={num}
                  value={num}
                >
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-indigo-300 hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>

            {/* Always show first page */}
            {currentPage > 3 && totalPages > 5 && (
              <button
                onClick={() => onPageChange(1)}
                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-indigo-300 hover:text-white focus:z-20 focus:outline-offset-0 md:inline-flex"
              >
                1
              </button>
            )}

            {/* Left ellipsis */}
            {showLeftEllipsis && <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">...</span>}

            {/* Page numbers */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  currentPage === page ? "z-10 bg-indigo-600 text-white focus-visible:outline-indigo-600" : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-indigo-300 hover:text-white focus:outline-offset-0"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Right ellipsis */}
            {showRightEllipsis && <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">...</span>}

            {/* Always show last page */}
            {currentPage < totalPages - 2 && totalPages > 5 && (
              <button
                onClick={() => onPageChange(totalPages)}
                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-indigo-300 hover:text-white focus:z-20 focus:outline-offset-0 md:inline-flex"
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-indigo-300 hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
