import { ProductContext } from '~/contexts/ProductContext';
import { useContext, useEffect } from 'react';
import { ToastContext } from '~/contexts/ToastContext';
import { AlertContext } from '~/contexts/AlertContext';
import classNames from 'classnames/bind';
import styles from './ProductTrash.module.scss';
import ProductItem from '~/components/ProductItem';
import Spinner from '~/components/Spinner';
import Button from '~/components/Button';
import config from '~/config';

const cx = classNames.bind(styles);

function ProductTrash() {
  const {
    productState: { trashProducts, productsLoading },
    getTrashProducts,
    restoreProduct,
    deleteForceProduct,
  } = useContext(ProductContext);

  // get all products

  useEffect(() => {
    getTrashProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toast
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const handleRestore = async (slug) => {
    try {
      const response = await restoreProduct(slug);
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
      } else {
        addToast({
          id: toastList.length + 1,
          title: 'Thất bại',
          content: response.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // alert
  const { alertShow } = useContext(AlertContext);

  let body = null;
  if (productsLoading) {
    body = <Spinner />;
  } else if (trashProducts.length === 0) {
    body = (
      <div className={cx('trash')}>
        <p>Thùng rác trống</p>
        <Button primary to={config.routes.products}>
          Đi tới trang sản phẩm
        </Button>
      </div>
    );
  } else {
    body = (
      <div className={cx(['row', 'sm-gutter'])}>
        {trashProducts.map((product, index) => (
          <div key={index} className="col l-2-4 m-4 c-6">
            <ProductItem product={product} trash={true} />
            <div className={cx('action')}>
              <Button
                primary
                className={cx('btn-restore')}
                onClick={() => {
                  handleRestore(product.slug);
                }}
              >
                Khôi phục
              </Button>
            </div>
            <div className={cx('action')}>
              <Button
                deleted
                className={cx('btn-force')}
                onClick={() => {
                  alertShow({
                    title: 'Bạn có muốn xóa sản phẩm vĩnh viễn không',
                    buttonValue: 'Xóa vĩnh viễn',
                    data: product.slug,
                    successFunction: deleteForceProduct,
                  });
                }}
              >
                Xóa vĩnh viễn
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return body;
}

export default ProductTrash;
