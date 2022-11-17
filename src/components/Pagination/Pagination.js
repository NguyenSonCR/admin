import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);
function Pagination({ totalProducts, pageSize, onChange, currentPage, onPreviousPage, onNextPage }) {
  const getPager = (totalProducts, currentPage, pageSize) => {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 20
    pageSize = pageSize || 20; // calculate total pages

    var totalPages = Math.ceil(totalProducts / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 20 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    } // calculate start and end item indexes

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalProducts - 1); // create an array of pages to ng-repeat in the pager control

    var pages = [...Array(endPage + 1 - startPage).keys()].map((i) => startPage + i); // return an object with all pager properties required by the view

    return {
      totalProducts: totalProducts,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  };

  const pageInfo = getPager(totalProducts, 1, pageSize);
  const { pages, totalPages } = pageInfo;

  return (
    <ul className={cx('pagination')}>
      <FontAwesomeIcon
        className={cx('icon', { iconDissable: currentPage === 1 })}
        onClick={() => {
          onPreviousPage(currentPage);
        }}
        icon={faAngleLeft}
      />
      {pages.map((number) => (
        <li key={number} className={cx('item')}>
          <span
            className={cx('item__link', { active: number === currentPage })}
            onClick={() => {
              onChange(number);
            }}
          >
            {number}
          </span>
        </li>
      ))}

      <FontAwesomeIcon
        className={cx('icon', { iconDissable: currentPage === totalPages })}
        onClick={() => {
          onNextPage(currentPage);
        }}
        icon={faAngleRight}
      />
    </ul>
  );
}

export default Pagination;
