import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string; // e.g., "participants", "users", "items"
  showInfo?: boolean; // Show "Showing X to Y of Z items" text
  className?: string; // Additional CSS classes
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = 'items',
  showInfo = true,
  className = '',
}) => {
  // Don't render if there's only one page or no items
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pagination with ellipsis logic
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible) {
        // Show first pages
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // Show last pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={`mt-4 flex flex-col md:flex-row justify-between items-center gap-2 ${className}`}>
      {/* Info text */}
      {showInfo && (
        <div className="text-xs md:text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} {itemName}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        {/* Previous button */}
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-2 py-1 text-xs sm:text-sm rounded-[10px] font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-none border-none"
        >
          <ChevronLeft size={16} /> Prev
        </Button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-1 text-xs sm:text-sm text-gray-400 bg-white rounded-[10px] cursor-default"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              onClick={() => handlePageClick(page as number)}
              className={`px-4 py-1 text-xs sm:text-sm rounded-[10px] font-medium hover:bg-lightBrown transition-colors mx-1 shadow-none border-none focus:outline-none focus:ring-0 focus:bg-[#FADFCB] focus:text-black active:bg-[#FADFCB] active:text-black select-none ${
                currentPage === page
                  ? "bg-[#FADFCB] !bg-[#FADFCB] text-black" // force background
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              {page}
            </Button>
          );
        })}

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-xs sm:text-sm rounded-[10px] font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-none border-none"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;