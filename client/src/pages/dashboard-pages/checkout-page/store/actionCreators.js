import { fromJS } from "immutable";
import { actionTypes } from ".";
import axios from "axios";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const getItemsCount = (allItems) => {
  const { soldItems, stockItems, employeeItems, exceptionItems } = allItems;
  var soldCount = 0;
  soldItems.forEach((item) => {
    soldCount += item["qty"];
  });

  var stockCount = 0;
  stockItems.forEach((item) => {
    stockCount += item["qty"];
  });

  var employeeCount = 0;
  employeeItems.forEach((item) => {
    employeeCount += item["qty"];
  });

  var exceptionCount = 0;
  exceptionItems.forEach((item) => {
    exceptionCount += item["qty"];
  });

  const allCount = soldCount + stockCount + employeeCount + exceptionCount;

  return { soldCount, stockCount, employeeCount, exceptionCount, allCount };
};

export const getAllItemsAction = async (dispatch) => {
  dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(true) });
  try {
    const response = await axios.get(serverBaseUrl + "/api/checkout/all_items");
    const allItems = response.data.result;

    var { soldItems, stockItems, employeeItems, exceptionItems } = allItems;

    soldItems = soldItems.map((item) => {
      item.key = item._id;
      return item;
    });

    stockItems = stockItems.map((item) => {
      item.key = item._id;
      return item;
    });

    employeeItems = employeeItems.map((item) => {
      item.key = item._id;
      return item;
    });

    exceptionItems = exceptionItems.map((item) => {
      item.key = item._id;
      return item;
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
  }
};
