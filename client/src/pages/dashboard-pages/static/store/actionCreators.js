import axios from "axios";
import { message } from "antd";
import bigDecimal from "js-big-decimal";
import { actionTypes } from ".";
import { fromJS } from "immutable";
import { actionCreators as checkoutActionCreators } from "../../checkout-page/store";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const initializeCartAction = async (dispatch) => {
  try {
    const response = await axios.get(serverBaseUrl + "/api/cart/items");
    const { result } = response.data;

    var cartItemsCount = 0;
    var cartSubtotal = 0;
    result.forEach((element) => {
      cartItemsCount += element.qty;
      cartSubtotal += element.payAmountToSender;
      element.cost = element.cost.toFixed(2);
      element.payAmountToSender = element.payAmountToSender.toFixed(2);
      if (element.originalType !== "employee") {
        element.payAmountFromCustomer =
          element.payAmountFromCustomer.toFixed(2);
        element.profits = element.profits.toFixed(2);
      }
    });
    const roundedPrettyCartSubtotal = new bigDecimal(
      cartSubtotal.toFixed(2)
    ).getPrettyValue();

    dispatch({ type: actionTypes.GET_CART_ITEMS, value: fromJS(result) });
    dispatch({
      type: actionTypes.CART_ITEMS_COUNT,
      value: fromJS(cartItemsCount),
    });
    dispatch({
      type: actionTypes.CART_SUBTOTAL,
      value: fromJS(roundedPrettyCartSubtotal),
    });
  } catch (error) {
    console.log(error);
    const { msg } = error.response.data;
    message.error(msg);
  }
};

export const removeFromCartAction = (record_id, solid_id, type, addToCart) => {
  console.log(record_id, solid_id, type, addToCart);
  return async (dispatch) => {
    try {
      const response = await axios.put(
        serverBaseUrl + "/api/cart/remove_item",
        { record_id, solid_id, type, addToCart }
      );
      const { msg } = response.data;
      message.success(msg);
      dispatch(checkoutActionCreators.getAllItemsAction);
      dispatch(initializeCartAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const setReturnAllProfitsItemAction = (_id, returnAllProfits) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        serverBaseUrl + "/api/cart/set_return_all_profits_item",
        { _id, returnAllProfits }
      );
      message.success(response.data.msg);
      dispatch(initializeCartAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const updateNoteAction = (info) => {
  return async () => {
    const { newNote, note, type, _id } = info;
    if (newNote !== undefined && note !== newNote) {
      try {
        const response = await axios.put(
          serverBaseUrl + "/api/checkout/update_note",
          { newNote, type, _id }
        );
        message.success(response.data.msg);
      } catch (error) {
        console.log(error);
        message.error(error.response.data.msg);
      }
    }
  };
};

export const finishPaymentAction = async (dispatch) => {
  try {
    const response = await axios.post(serverBaseUrl + "/api/transaction/add");
    message.success(response.data.msg);
    dispatch(initializeCartAction);
    dispatch(checkoutActionCreators.getAllItemsAction);
  } catch (error) {
    console.log(error);
    message.error(error.response.data.msg);
  }
};
