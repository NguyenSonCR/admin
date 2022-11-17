import {
  ORDER_LOADED_FAIL,
  ORDER_LOADED_SUCCESS,
  DELETE_SOFT_ORDER,
  RESTORE_ORDER,
  ORDER_DONE,
  CONFIRM_ORDER,
  PACKED_ORDER,
  SHIPPER_ORDER,
  TRANSPORTED_ORDER,
  DONE_ORDER,
  DESTROY_ORDER,
} from '~/contexts/constants';

export const orderReducer = (state, action) => {
  const {
    type,
    payload: { orders, ordersDone, order, id },
  } = action;
  switch (type) {
    case ORDER_LOADED_SUCCESS:
      return {
        ...state,
        orders: orders,
        confirm: orders.filter((item) => {
          return item.state.confirm === false;
        }),
        packed: orders.filter((item) => {
          return item.state.confirm === true && item.state.packed === false;
        }),
        shipper: orders.filter((item) => {
          return item.state.confirm === true && item.state.packed === true && item.state.shipper === false;
        }),
        transported: orders.filter((item) => {
          return (
            item.state.confirm === true &&
            item.state.packed === true &&
            item.state.shipper === true &&
            item.state.transported === false
          );
        }),
        done: orders.filter((item) => {
          return (
            item.state.confirm === true &&
            item.state.packed === true &&
            item.state.shipper === true &&
            item.state.transported === true &&
            item.state.done === true
          );
        }),
        orderLoading: false,
      };

    case ORDER_DONE:
      return {
        ...state,
        ordersDone: ordersDone,
        orderLoading: false,
      };

    case ORDER_LOADED_FAIL:
      return {
        ...state,
        order: [],
        confirm: [],
        packed: [],
        shipper: [],
        transported: [],
        done: [],
        orders: [],
        orderLoading: false,
      };

    case CONFIRM_ORDER:
      return {
        ...state,
        confirm: state.confirm.filter((item) => {
          return item._id !== order._id;
        }),
        packed: state.packed.concat(order),
      };

    case PACKED_ORDER:
      return {
        ...state,
        packed: state.packed.filter((item) => {
          return item._id !== order._id;
        }),
        shipper: state.shipper.concat(order),
      };

    case SHIPPER_ORDER:
      return {
        ...state,
        shipper: state.shipper.filter((item) => {
          return item._id !== order._id;
        }),
        transported: state.transported.concat(order),
      };

    case TRANSPORTED_ORDER:
      return {
        ...state,
        transported: state.transported.filter((item) => {
          return item._id !== order._id;
        }),
        done: state.done.concat(order),
      };

    case DONE_ORDER:
      return {
        ...state,
        done: state.done.filter((item) => {
          return item._id !== order._id;
        }),
      };
    case DELETE_SOFT_ORDER:
      return {
        ...state,
        orders: state.orders.filter((item) => {
          return item._id !== id;
        }),
      };

    case RESTORE_ORDER:
      return {
        ...state,
        ordersDone: state.ordersDone.filter((item) => {
          return item._id !== id;
        }),
      };

    case DESTROY_ORDER:
      return {
        ...state,
        ordersDone: state.ordersDone.filter((item) => {
          return item._id !== id;
        }),
      };

    default:
      return state;
  }
};
