import React, { useState } from 'react';

const Pagination = ({ paginate, totalPages }) => {
  const [currentPageGroup, setCurrentPageGroup] = useState(1); // Tracks the current group of 10 pages

  const pagesPerGroup = 10; // Limit of pages per group
  const totalGroups = Math.ceil(totalPages / pagesPerGroup); // Total number of groups

  // Calculate the start and end page numbers for the current group
  const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  // Generate the page numbers for the current group
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Handle the '...' button to load the next group of pages
  const loadNextGroup = () => {
    if (currentPageGroup < totalGroups) {
      setCurrentPageGroup(currentPageGroup + 1);
    }
  };

  // Handle the '...' button to load the previous group of pages
  const loadPreviousGroup = () => {
    if (currentPageGroup > 1) {
      setCurrentPageGroup(currentPageGroup - 1);
    }
  };

  return (
    <div className="pagination">
      <ul className="pagination-list">
        {/* Previous '...' button */}
        {currentPageGroup > 1 && (
          <li>
            <a className="page-link" onClick={loadPreviousGroup}>
              ...
            </a>
          </li>
        )}

        {/* Page numbers */}
        {pageNumbers.map((num) => (
          <li key={num}>
            <a
              className="page-link"
              onClick={() => paginate(num)}
            >
              {num}
            </a>
          </li>
        ))}

        {/* Next '...' button */}
        {currentPageGroup < totalGroups && (
          <li>
            <a className="page-link" onClick={loadNextGroup}>
              ...
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;