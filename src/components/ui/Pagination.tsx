import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const chevronStyles = 'p-1 hover:bg-secondary-200 dark:hover:bg-dark-100 rounded-md transition-all duration-300'
  return (
    <div className="flex gap-1 justify-center items-center p-1 dark:text-light-100">
        <ChevronLeft className={chevronStyles} onClick={handlePrev} strokeWidth={1.5}/>
      <span >
        Page {currentPage} of {totalPages}
      </span>
      <ChevronRight className={chevronStyles} onClick={handleNext} strokeWidth={1.5}/>
    </div>
  );
};

export default Pagination;
