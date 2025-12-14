import { useState, useMemo } from 'react';

export function usePagination(itemsPerPage: number = 5) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageSelected, setItemsPerPageSelected] = useState(itemsPerPage);

  const paginate = useMemo(
    () =>
      <T>(items: T[]) => {
        const totalPages = Math.ceil(items.length / itemsPerPageSelected);
        const startIndex = (currentPage - 1) * itemsPerPageSelected;
        const endIndex = startIndex + itemsPerPageSelected;
        const paginatedItems = items.slice(startIndex, endIndex);

        return {
          paginatedItems,
          totalPages,
          startIndex,
          endIndex,
          totalItems: items.length,
        };
      },
    [currentPage, itemsPerPageSelected],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPageSelected(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPageSelected,
    paginate,
    handlePageChange,
    handleItemsPerPageChange,
  };
}
