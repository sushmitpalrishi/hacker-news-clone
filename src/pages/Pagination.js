import React from "react";
import "./pagination.css";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  //console.log("postPerPage = ", postsPerPage);
  //console.log("totalPosts = ", totalPosts);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  //   console.log("pageNumbers = ",pageNumbers);
  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
