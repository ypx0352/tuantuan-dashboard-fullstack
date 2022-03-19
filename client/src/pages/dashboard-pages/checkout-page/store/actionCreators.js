import { fromJS } from "immutable";
import { message } from "antd";
import { actionTypes } from ".";
import axios from "axios";
import { actionCreators } from "../../static/store";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const getItemsCount = (allItems) => {
  const counts = [];
  var allCount = 0;
  Object.entries(allItems).forEach((entry) => {
    var result = 0;
    entry[1].forEach((item) => {
      result += item.qty;
    });
    counts.push(result);
    allCount += result;
  });
  const [soldCount, stockCount, employeeCount, exceptionCount] = counts;
  return { soldCount, stockCount, employeeCount, exceptionCount, allCount };
};

export const getAllItemsAction = async (dispatch) => {
  dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(true) });
  try {
    const response = await axios.get(serverBaseUrl + "/api/checkout/all_items");
    const allItems = response.data.result;

    // Add date entry in item object to record the updated date
    // Add qty_available entry

    Object.entries(allItems).forEach((entry) => {
      entry[1].forEach((item) => {
        item.dateTime = new Date(item.updatedAt).toLocaleString();
        item.qty_available = item.qty - item.qty_in_cart;
      });
    });

    dispatch({
      type: actionTypes.SET_ALL_ITEMS,
      value: fromJS(allItems),
    });

    dispatch({
      type: actionTypes.SET_ITEMS_COUNT,
      value: fromJS(getItemsCount(allItems)),
    });

    dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(false) });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(false) });
    const { msg } = error.response.data;
    message.error(msg);
  }
};

export const addToStockAction = (record) => {
  return async (dispatch) => {
    const { addToStock, _id, type } = record;
    try {
      const response = await axios.put(
        serverBaseUrl + "/api/checkout/add_to_stock",
        { addToStock, _id, type }
      );
      const { msg } = response.data;
      message.success(msg);
      dispatch(getAllItemsAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const addToEmployeeAction = (record) => {
  return async (dispatch) => {
    const { addToEmployee, _id, type } = record;
    try {
      const response = await axios.put(
        serverBaseUrl + "/api/checkout/add_to_employee",
        { addToEmployee, _id, type }
      );
      const { msg } = response.data;
      message.success(msg);
      dispatch(getAllItemsAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const addToCartAction = (record) => {
  return async (dispatch) => {
    const { addToCart, _id, type } = record;
    var payload = { addToCart, _id, type };
    if (type !== "employee") {
      const { subtotal } = record;
      payload = { addToCart, _id, type, subtotal };
    }
    try {
      const response = await axios.post(
        serverBaseUrl + "/api/cart/add_to_cart",
        payload
      );
      const { msg } = response.data;
      message.success(msg);
      dispatch(getAllItemsAction);
      dispatch(actionCreators.initializeCartAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const addToExceptionAction = (item) =>{
  return  async (dispatch)=>{
    const response = await axios.put(
      serverBaseUrl + "/api/checkout/add_to_exception", item
    );
    console.log(response);
  }
} 
