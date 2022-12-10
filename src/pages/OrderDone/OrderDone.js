import classNames from 'classnames/bind';
import styles from './OrderDone.module.scss';
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '~/contexts/OrderContext';
import { ToastContext } from '~/contexts/ToastContext';
import Button from '~/components/Button';
import Pagination from '~/components/Pagination';

const cx = classNames.bind(styles);
function OrderDone() {
  const {
    orderState: { ordersDone },
    getOrdersDone,
    destroyOrder,
  } = useContext(OrderContext);

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  useEffect(() => {
    getOrdersDone();
    // eslint-disable-next-line
  }, []);

  const handleDeleteOrder = async (id) => {
    try {
      const response = await destroyOrder(id);
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: 'Đã xóa đơn hàng thành công',
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

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  let startIndex = (pageNumber - 1) * 10;
  let endIndex = Math.min(startIndex + 10, ordersDone.length);
  const currentPage = ordersDone.slice(startIndex, endIndex);
  const pageChange = (number) => {
    setPageNumber(number);
  };

  const onPreviousPage = (currentPage) => {
    if (currentPage > 1) setPageNumber(currentPage - 1);
  };

  var totalPages = Math.ceil(ordersDone.length / 10);
  const onNextPage = (currentPage) => {
    if (currentPage < totalPages) setPageNumber(currentPage + 1);
  };

  let body = null;

  if (currentPage && currentPage.length > 0) {
    body = (
      <div className={cx('wrapper-order')}>
        <div className={cx('header')}> Trang quản lý đơn hàng </div>
        <div className={cx('order-page')}>
          {currentPage.map((order, index) => (
            <div key={index} className={cx('order')}>
              <div className={cx('user')}>
                <div className={cx('user-list')}> Mã đơn hàng: {order._id}</div>
                <div className={cx('user-list')}> Tên khách hàng: {order.user.fullName} </div>
                <div className={cx('user-list')}> Địa chỉ giao hàng: {order.user.address}</div>
                <div className={cx('user-list')}> Số điện thoại khách hàng: {order.user.phoneNumber} </div>
              </div>

              {order.checkout.map((item, index) => (
                <div key={index} className={cx('product')}>
                  <div className={cx('product-header')}>
                    <img className={cx('product-img')} src={item.product.img} alt={item.product.name}></img>
                    <div className={cx('product-list')}>{item.product.name} </div>
                  </div>

                  <div className={cx('product-list')}> Số lượng: {item.amount}</div>
                  <div className={cx('product-list')}>
                    Giá: {item.priceCurrent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                  </div>
                  <div className={cx('product-list')}>
                    Tổng: {(item.amount * item.priceCurrent).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                  </div>
                </div>
              ))}
              <div className={cx('action')}>
                <Button deleted onClick={() => handleDeleteOrder(order._id)}>
                  Xóa đơn hàng
                </Button>
              </div>
            </div>
          ))}

          <Pagination
            totalProducts={ordersDone.length}
            onChange={pageChange}
            currentPage={pageNumber}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
          />
        </div>
      </div>
    );
  } else {
    body = (
      <div className={cx('wrapper')}>
        <p className={cx('text')}>Chưa có đơn hàng nào</p>
      </div>
    );
  }
  return body;
}

export default OrderDone;
