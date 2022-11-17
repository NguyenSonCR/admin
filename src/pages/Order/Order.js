import styles from './Order.module.scss';
import classNames from 'classnames/bind';
import { useState, useContext, useEffect } from 'react';
import { OrderContext } from '~/contexts/OrderContext';
import OrderContent from '~/layouts/components/OrderContent';

const cx = classNames.bind(styles);

function Order() {
  const [content, setContent] = useState(2);

  const {
    orderState: { confirm, packed, shipper, transported, done, orders },
    getOrders,
  } = useContext(OrderContext);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line
  }, [content]);

  const onHandleSetContent = (number) => {
    setContent(number);
  };
  return (
    <div className={cx('purchase')}>
      <div className={cx(['row'])}>
        <div className={cx(['col', 'l-12', 'm-12', 'c-12'])}>
          <div className={cx('body')}>
            <div className={cx('header')}>
              <div className={cx('header-tab', content === 1 && 'active')} onClick={() => onHandleSetContent(1)}>
                <p className={cx('tab-title')}>
                  Tất cả
                  {orders.length > 0 && <span>({orders.length})</span>}
                </p>
              </div>
              <div className={cx('header-tab', content === 2 && 'active')} onClick={() => onHandleSetContent(2)}>
                <p className={cx('tab-title')}>
                  Chờ xác nhận
                  {confirm.length > 0 && <span>({confirm.length})</span>}
                </p>
              </div>
              <div className={cx('header-tab', content === 3 && 'active')} onClick={() => onHandleSetContent(3)}>
                <p className={cx('tab-title')}>
                  Chờ đóng gói
                  {packed.length > 0 && <span>({packed.length})</span>}
                </p>
              </div>
              <div className={cx('header-tab', content === 4 && 'active')} onClick={() => onHandleSetContent(4)}>
                <p className={cx('tab-title')}>
                  Chờ vận chuyển
                  {shipper.length > 0 && <span>({shipper.length})</span>}
                </p>
              </div>
              <div className={cx('header-tab', content === 5 && 'active')} onClick={() => onHandleSetContent(5)}>
                <p className={cx('tab-title')}>
                  Đang giao
                  {transported.length > 0 && <span>({transported.length})</span>}
                </p>
              </div>
              <div className={cx('header-tab', content === 6 && 'active')} onClick={() => onHandleSetContent(6)}>
                <p className={cx('tab-title')}>
                  Đã giao
                  {done.length > 0 && <span>({done.length})</span>}
                </p>
              </div>
              <div className={cx('header-tab', content === 7 && 'active')} onClick={() => onHandleSetContent(7)}>
                <p className={cx('tab-title')}>Đã hủy</p>
              </div>
            </div>
            <div className={cx('content')}>
              <OrderContent content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
