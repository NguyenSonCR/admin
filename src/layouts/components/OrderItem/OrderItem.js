import styles from './OrderItem.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Pagination from '~/components/Pagination';
import { OrderContext } from '~/contexts/OrderContext';
import { useContext, useState } from 'react';
import { ToastContext } from '~/contexts/ToastContext';
import { ProductContext } from '~/contexts/ProductContext';
import { TransportContext } from '~/contexts/TransportContext';
import { useEffect } from 'react';

const cx = classNames.bind(styles);
function OrderItem({ data }) {
  const { confirmOrder, deleteSoftOrder, packedOrder, shipperOrder, transportedOrder, doneOrder } =
    useContext(OrderContext);

  const {
    transportState: { transports },
    getTransport,
  } = useContext(TransportContext);

  useEffect(() => {
    getTransport();
    // eslint-disable-next-line
  }, []);

  const { addBought } = useContext(ProductContext);
  const { title, orderList, type } = data;
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const handleConfirm = async (order) => {
    try {
      const response = await confirmOrder({
        id: order._id,
        confirm: true,
        cancel: false,
        packed: false,
        shiper: false,
        transported: false,
        done: false,
      });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: 'Đã xác nhận đơn hàng thành công',
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

  const handlePacked = async (order) => {
    try {
      const response = await packedOrder({
        id: order._id,
        confirm: true,
        cancel: false,
        packed: true,
        shipper: false,
        transported: false,
        done: false,
      });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: 'Đã đóng gói đơn hàng thành công',
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

  const handleShipper = async (order) => {
    try {
      const response = await shipperOrder({
        id: order._id,
        confirm: true,
        cancel: false,
        packed: true,
        shipper: true,
        shipperOrigan: transports && transports[0].name,
        transported: false,
        done: false,
      });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: 'Đã vận chuyển đơn hàng thành công',
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

  const handleTranported = async (order) => {
    try {
      const response = await transportedOrder({
        id: order._id,
        confirm: true,
        cancel: false,
        packed: true,
        shipper: true,
        transported: true,
        done: true,
      });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: 'Đã giao hàng thành công',
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

  const handleDoneOrder = async (order) => {
    try {
      const response = await deleteSoftOrder(order._id);
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: 'Đã cho vào kho hàng thành công',
          type: 'success',
        });
        doneOrder(order);
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

  const handelAddBought = (checkout) => {
    addBought(checkout);
  };

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  let startIndex = (pageNumber - 1) * 10;
  let endIndex = Math.min(startIndex + 10, orderList.length);
  const pageChange = (number) => {
    setPageNumber(number);
  };

  const onPreviousPage = (currentPage) => {
    if (currentPage > 1) setPageNumber(currentPage - 1);
  };

  var totalPages = Math.ceil(orderList.length / 10);
  const onNextPage = (currentPage) => {
    if (currentPage < totalPages) setPageNumber(currentPage + 1);
  };
  const currentPage = orderList.slice(startIndex, endIndex);

  let body = null;
  if (orderList.length === 0) {
    body = (
      <div className={cx('no-list')}>
        <div className={cx('no-list-text')}>Không có đơn hàng nào</div>
      </div>
    );
  } else {
    body = (
      <div className={cx('wrapper')}>
        <div className={cx('header')}>
          <p className={cx('header-text')}>{title}</p>
        </div>
        {currentPage &&
          currentPage.map((order, index) => (
            <div key={index} className={cx('main')}>
              {type === 5 && (
                <div className={cx('header')}>
                  <div className={cx('shipping')}>{order.shipper}</div>
                  <p className={cx('header-text')}>{title}</p>
                </div>
              )}
              <div className={cx('order')}>
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
                  {type === 1 ? (
                    <div className={cx('action-state')}>
                      <p className={cx('state-text')}>Trạng thái đơn hàng:</p>
                      <p className={cx('state-text')}>
                        {order.state.confirm === false
                          ? 'Chờ xác nhận'
                          : order.state.packed === false
                          ? 'Chờ đóng gói'
                          : order.state.done === true
                          ? 'Đã giao hàng'
                          : 'Đang giao hàng'}
                      </p>
                    </div>
                  ) : type === 2 ? (
                    <Button
                      primary
                      onClick={() => {
                        handleConfirm(order);
                      }}
                    >
                      Xác nhận
                    </Button>
                  ) : type === 3 ? (
                    <Button
                      primary
                      onClick={() => {
                        handlePacked(order);
                      }}
                    >
                      Đã đóng hàng
                    </Button>
                  ) : type === 4 ? (
                    <div>
                      <Button
                        primary
                        onClick={() => {
                          handleShipper(order);
                        }}
                      >
                        Đã vận chuyển
                      </Button>
                    </div>
                  ) : type === 5 ? (
                    <Button
                      primary
                      onClick={() => {
                        handleTranported(order);
                      }}
                    >
                      Đã giao xong
                    </Button>
                  ) : (
                    <Button
                      primary
                      onClick={() => {
                        handleDoneOrder(order);

                        handelAddBought(order.checkout);
                      }}
                    >
                      Cho vào kho hàng
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

        <Pagination
          pageSize={10}
          totalProducts={orderList.length}
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

export default OrderItem;
