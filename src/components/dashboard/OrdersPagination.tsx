import ReactPaginate from "react-paginate";
import { cn } from "@/utils";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function OrdersPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: OrdersPaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <div
      className={cn(
        "mt-5 flex items-center justify-center gap-10 border-t border-gray-100 pt-4 dark:border-gray-800",
        className,
      )}
    >
      <ReactPaginate
        forcePage={currentPage - 1}
        pageCount={totalPages}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => handlePageChange({ selected })}
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        containerClassName="flex items-center gap-2"
        pageClassName="cursor-pointer rounded-md border border-gray-300 py-1.5 text-theme-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
        pageLinkClassName="block px-4 py-1.5"
        previousLinkClassName={cn(
          "hidden rounded-md border border-gray-300 px-4 py-2 text-theme-sm lg:block dark:border-gray-700",
          currentPage === 1
            ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
            : "text-gray-700 dark:text-gray-300",
        )}
        nextLinkClassName={cn(
          "hidden rounded-md border border-gray-300 px-6 py-2 text-theme-sm lg:block dark:border-gray-700",
          currentPage >= totalPages
            ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
            : "text-gray-700 dark:text-gray-300",
        )}
        breakClassName="mx-2 text-gray-500"
        activeClassName="!border-brand-500 bg-brand-500 text-white dark:!border-brand-500"
        activeLinkClassName="text-white"
        disabledClassName="pointer-events-none opacity-50"
      />
    </div>
  );
}
