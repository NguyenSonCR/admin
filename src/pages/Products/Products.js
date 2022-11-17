import { ProductContext } from '~/contexts/ProductContext';
import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Products.module.scss';
import ProductItem from '~/components/ProductItem';
import Spinner from '~/components/Spinner';
import { Link } from 'react-router-dom';
import config from '~/config';
import Pagination from '~/components/Pagination';

const cx = classNames.bind(styles);

function Products() {
  const {
    productState: { products, productsLoading },
    getProducts,
  } = useContext(ProductContext);

  // get all products

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pageNumber, setPageNumber] = useState(1);
  let startIndex = (pageNumber - 1) * 10;
  let endIndex = Math.min(startIndex + 10, products.length);
  const currentPage = products.slice(startIndex, endIndex);
  const pageChange = (number) => {
    setPageNumber(number);
  };

  const onPreviousPage = (currentPage) => {
    if (currentPage > 1) setPageNumber(currentPage - 1);
  };

  var totalPages = Math.ceil(products.length / 10);
  const onNextPage = (currentPage) => {
    if (currentPage < totalPages) setPageNumber(currentPage + 1);
  };

  let body = null;
  if (productsLoading) {
    body = <Spinner />;
  } else if (products.length === 0) {
    body = (
      <div className={cx('wrapper')}>
        <p className={cx('text')}>Bạn chưa đăng sản phẩm nào</p>
        <Link to={config.routes.create} className={cx('link')}>
          Thêm mới sản phẩm
        </Link>
      </div>
    );
  } else {
    body = (
      <div className={cx('wrapper-product')}>
        <div className={cx(['row', 'sm-gutter'])}>
          {currentPage.map((product, index) => (
            <div key={index} className="col l-2-4 m-4 c-6">
              <ProductItem product={product} />
            </div>
          ))}
        </div>
        <Pagination
          pageSize={10}
          totalProducts={products.length}
          onChange={pageChange}
          currentPage={pageNumber}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </div>
    );
  }
  return body;
}

export default Products;
