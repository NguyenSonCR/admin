import OrderItem from '../OrderItem';
import { useContext, useEffect } from 'react';
import { OrderContext } from '~/contexts/OrderContext';
function OrderContent({ content }) {
  const {
    orderState: { confirm, packed, shipper, transported, done, orders, orderLoading },
    getOrders,
  } = useContext(OrderContext);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line
  }, [content, orderLoading]);
  let body = null;
  switch (content) {
    case 1:
      body = <OrderItem data={{ title: 'TẤT CẢ', type: content, orderList: orders }} />;
      break;
    case 2:
      body = (
        <OrderItem
          data={{
            title: 'CHỜ XÁC NHẬN',
            shipping: null,
            type: content,
            orderList: confirm,
          }}
        />
      );
      break;
    case 3:
      body = <OrderItem data={{ title: 'CHỜ ĐÓNG GÓI', type: content, orderList: packed }} />;
      break;

    case 4:
      body = <OrderItem data={{ title: 'CHỜ VẬN CHUYỂN', type: content, orderList: shipper }} />;
      break;
    case 5:
      body = (
        <OrderItem
          data={{
            title: 'ĐANG GIAO',
            type: content,
            orderList: transported,
          }}
        />
      );
      break;
    case 6:
      body = <OrderItem data={{ title: 'ĐÃ GIAO', type: content, orderList: done }} />;
      break;
    case 7:
      body = <OrderItem data={{ title: 'ĐÃ HỦY', type: content, orderList: [] }} />;
      break;
    default:
      break;
  }
  return body;
}

export default OrderContent;
