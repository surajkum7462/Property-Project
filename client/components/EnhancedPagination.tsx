import React, { memo, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PaginationProps } from '@shared/api';

interface EnhancedPaginationProps extends PaginationProps {
  totalItems?: number;
  itemsPerPage?: number;
  showPageSize?: boolean;
  showJumpToPage?: boolean;
  showItemRange?: boolean;
  showQuickJump?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

const PageButton = memo(({ 
  page, 
  isActive, 
  onClick, 
  disabled = false 
}: { 
  page: number | string; 
  isActive?: boolean; 
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={`min-w-[40px] ${isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
  >
    {page}
  </Button>
));

PageButton.displayName = 'PageButton';

export const EnhancedPagination = memo(function EnhancedPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 12,
  showPageSize = true,
  showJumpToPage = true,
  showItemRange = true,
  showQuickJump = true,
  pageSizeOptions = [8, 12, 16, 24, 48],
  onPageSizeChange,
  maxVisiblePages = 7,
  className = ""
}: EnhancedPaginationProps) {
  
  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= halfVisible) {
        endPage = Math.min(totalPages, maxVisiblePages);
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }
      
      // Always show first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Show visible range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Always show last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Calculate item range display
  const itemRange = useMemo(() => {
    if (!totalItems) return null;
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    return { start, end };
  }, [currentPage, itemsPerPage, totalItems]);

  // Navigation handlers
  const handleFirstPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleLastPage = useCallback(() => {
    onPageChange(totalPages);
  }, [totalPages, onPageChange]);

  const handlePageClick = useCallback((page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  }, [onPageChange]);

  // Quick jump functionality
  const handleQuickJump = useCallback((direction: 'back' | 'forward') => {
    const jump = Math.max(1, Math.floor(maxVisiblePages / 2));
    if (direction === 'back') {
      onPageChange(Math.max(1, currentPage - jump));
    } else {
      onPageChange(Math.min(totalPages, currentPage + jump));
    }
  }, [currentPage, totalPages, maxVisiblePages, onPageChange]);

  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Item Range and Page Size Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Item Range Display */}
        {showItemRange && totalItems && itemRange && (
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{itemRange.start.toLocaleString()}</span> to{' '}
            <span className="font-medium">{itemRange.end.toLocaleString()}</span> of{' '}
            <span className="font-medium">{totalItems.toLocaleString()}</span> results
          </div>
        )}

        {/* Page Size Selector */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        )}
      </div>

      {/* Main Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
        {/* Navigation Info */}
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1 order-1 sm:order-2">
          {/* First Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Quick Jump Back */}
          {showQuickJump && currentPage > maxVisiblePages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickJump('back')}
              className="hidden md:flex"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}

          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {visiblePages.map((page, index) => (
              <PageButton
                key={`${page}-${index}`}
                page={page}
                isActive={page === currentPage}
                onClick={() => handlePageClick(page)}
                disabled={page === '...'}
              />
            ))}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Quick Jump Forward */}
          {showQuickJump && currentPage < totalPages - maxVisiblePages + 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickJump('forward')}
              className="hidden md:flex"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}

          {/* Last Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Jump to Page */}
        {showJumpToPage && totalPages > 10 && (
          <div className="flex items-center gap-2 order-3">
            <span className="text-sm text-gray-600">Go to:</span>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => onPageChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <SelectItem key={page} value={page.toString()}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Mobile-Only Simple Navigation */}
      <div className="flex sm:hidden justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex-1 mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded">
          {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex-1 ml-2"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
});

// Simple pagination component for basic use cases
export const SimplePagination = memo(function SimplePagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  return (
    <EnhancedPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showPageSize={false}
      showJumpToPage={false}
      showItemRange={false}
      showQuickJump={false}
      maxVisiblePages={5}
    />
  );
});
