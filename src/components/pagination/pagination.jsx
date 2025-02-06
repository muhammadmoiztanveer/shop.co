// import React, { useState } from "react";
// import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";

// const Pagination = ({ totalPages, currentPage, onPageChange }) => {
//   // const [currentPage, setCurrentPage] = useState(1);

//   // Function to handle page changes
//   // const handlePageChange = (page, event) => {
//   //   event.preventDefault();

//   //   if (page > 0 && page <= totalPages) {
//   //     setCurrentPage(page);
//   //   }
//   // };

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       onPageChange(page); // Notify the parent component of the page change
//     }
//   };

//   // Calculate the pages to show with ellipsis
//   const getPageNumbers = () => {
//     const range = 2; // How many page numbers before and after the current page to show
//     let pages = [];

//     if (totalPages <= 7) {
//       // Show all page numbers if there are less than 7 pages
//       pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else {
//       // Show the first page, last page, and range of pages around the current page
//       if (currentPage <= range + 1) {
//         // If current page is near the start
//         pages = [1, 2, 3, "...", totalPages];
//       } else if (currentPage >= totalPages - range) {
//         // If current page is near the end
//         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
//       } else {
//         // Otherwise, show the current page, and some pages around it
//         pages = [
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages,
//         ];
//       }
//     }

//     return pages;
//   };

//   // Render the page number buttons
//   const renderPageNumbers = () => {
//     return getPageNumbers().map((page, index) => {
//       if (page === "...") {
//         return (
//           <span key={index} className="px-4 py-2 text-gray-500 cursor-default">
//             ...
//           </span>
//         );
//       } else {
//         return (
//           <button
//             key={index}
//             onClick={(event) => handlePageChange(page, event)}
//             className={`px-4 py-2 text-base rounded-xl ${
//               page === currentPage
//                 ? "bg-black text-white"
//                 : "bg-white text-gray-500 hover:bg-gray-100"
//             }`}
//           >
//             {page}
//           </button>
//         );
//       }
//     });
//   };

//   return (
//     <div className="flex items-center justify-between space-x-2 w-full">
//       {/* Previous Button */}
//       <a
//         href="#"
//         onClick={(event) => handlePageChange(currentPage - 1, event)}
//         className="flex items-center justify-center gap-2 px-4 h-10 text-base font-medium text-white bg-black border border-black rounded-lg"
//         disabled={currentPage === 1}
//       >
//         <ArrowLeftOutlined />
//         Previous
//       </a>

//       <div>{renderPageNumbers()}</div>

//       {/* Next Button */}
//       <a
//         href="#"
//         onClick={(event) => handlePageChange(currentPage + 1, event)}
//         className="flex items-center justify-center gap-2 px-4 h-10 text-base font-medium text-white bg-black border border-black rounded-lg"
//         disabled={currentPage === totalPages}
//       >
//         Next
//         <ArrowRightOutlined />
//       </a>
//     </div>
//   );
// };

// export default Pagination;

import React from "react";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const range = 2;
    let pages = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= range + 1) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - range) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  const renderPageNumbers = () => {
    return getPageNumbers().map((page, index) => {
      if (page === "...") {
        return (
          <span key={index} className="px-4 py-2 text-gray-500 cursor-default">
            ...
          </span>
        );
      } else {
        return (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 text-base rounded-xl ${
              page === currentPage
                ? "border border-black text-black"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      }
    });
  };

  return (
    <div className="flex items-center justify-between space-x-2 w-full">
      {/* Previous Button */}
      <a
        href="#"
        onClick={() => handlePageChange(currentPage - 1)}
        className="flex items-center justify-center gap-2 px-4 h-10 text-base font-medium text-black border border-black rounded-lg"
        disabled={currentPage === 1}
      >
        <ArrowLeftOutlined />
        Previous
      </a>
      <div>{renderPageNumbers()}</div>
      {/* Next Button */}
      <a
        href="#"
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex items-center justify-center gap-2 px-4 h-10 text-base font-medium text-black border border-black rounded-lg"
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRightOutlined />
      </a>
    </div>
  );
};

export default Pagination;
