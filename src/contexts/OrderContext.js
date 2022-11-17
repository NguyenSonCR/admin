import { createContext, useReducer } from 'react';
import { orderReducer } from '~/reducers/orderReducer';
import axiosJWT from '~/utils/setAxios';
import {
  apiUrl,
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
} from './constants';

export const OrderContext = createContext();
function OrderContextProvider({ children }) {
  const [orderState, dispatch] = useReducer(orderReducer, {
    ordersDone: [],
    confirm: [],
    packed: [],
    shipper: [],
    transported: [],
    done: [],
    orders: [],
    orderLoading: true,
  });

  // get all orders
  const getOrders = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/order`);
      if (response.data.success) {
        dispatch({
          type: ORDER_LOADED_SUCCESS,
          payload: {
            orders: response.data.orders,
          },
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  // get orders with type
  const getOrdersType = async (type) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/order/${type}`);
      if (response.data.success) {
        dispatch({ type: ORDER_LOADED_SUCCESS, payload: { orders: response.data.orders } });
      }
    } catch (error) {
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  const confirmOrder = async (orderUpdated) => {
    const { id } = orderUpdated;
    try {
      const response = await axiosJWT.put(`${apiUrl}/order/${id}/updated`, orderUpdated);
      if (response.data.success) {
        dispatch({ type: CONFIRM_ORDER, payload: { order: response.data.order } });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  const packedOrder = async (orderUpdated) => {
    const { id } = orderUpdated;
    try {
      const response = await axiosJWT.put(`${apiUrl}/order/${id}/updated`, orderUpdated);
      if (response.data.success) {
        dispatch({ type: PACKED_ORDER, payload: { order: response.data.order } });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  const shipperOrder = async (orderUpdated) => {
    const { id } = orderUpdated;
    try {
      const response = await axiosJWT.put(`${apiUrl}/order/${id}/updated`, orderUpdated);
      if (response.data.success) {
        dispatch({ type: SHIPPER_ORDER, payload: { order: response.data.order } });
      }
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  const transportedOrder = async (orderUpdated) => {
    const { id } = orderUpdated;
    try {
      const response = await axiosJWT.put(`${apiUrl}/order/${id}/updated/tranported`, orderUpdated);
      if (response.data.success) {
        dispatch({ type: TRANSPORTED_ORDER, payload: { order: response.data.order } });
      }
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  const doneOrder = (order) => {
    dispatch({ type: DONE_ORDER, payload: { order: order } });
  };
  //get all orders done
  const getOrdersDone = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/order/done`);

      if (response.data.success) {
        dispatch({ type: ORDER_DONE, payload: { ordersDone: response.data.ordersDone } });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  // delete soft order
  const deleteSoftOrder = async (id) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/order/${id}/delete`);
      if (response.data.success) {
        dispatch({
          type: DELETE_SOFT_ORDER,
          payload: { id },
        });
      }
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch({ type: ORDER_LOADED_FAIL });
    }
  };

  // restore order
  const restoreOrder = async (id) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/order/done/${id}/restore`);
      if (response.data.success) {
        dispatch({ type: RESTORE_ORDER, payload: { id: id } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // destroy order
  const destroyOrder = async (id) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/order/done/${id}/destroy`);
      if (response.data.success) {
        dispatch({ type: DESTROY_ORDER, payload: { id: id } });
      } else {
        dispatch({ type: ORDER_LOADED_FAIL });
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const orderContextData = {
    orderState,
    getOrders,
    deleteSoftOrder,
    restoreOrder,
    getOrdersDone,
    getOrdersType,
    confirmOrder,
    packedOrder,
    shipperOrder,
    transportedOrder,
    doneOrder,
    destroyOrder,
  };

  return <OrderContext.Provider value={orderContextData}>{children}</OrderContext.Provider>;
}

export default OrderContextProvider;
