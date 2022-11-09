import _ from "lodash";

const Pagination = ({ items, pageSize, currentPage, onPageChange }) => {
  const pageCount = items / pageSize;

  if (Math.ceil(pageCount) === 1) return null;

  const pages = _.range(1, pageCount + 1);

  return (
    <nav>
      <ul>
        {pages.map((page) => (
          <li key={page}>
            <a onClick={() => onPageChange(page)}>{page}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
