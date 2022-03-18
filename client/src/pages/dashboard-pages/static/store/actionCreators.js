import axios from "axios";
import { message } from "antd";
import { actionTypes } from ".";
import { fromJS } from "immutable";
import { actionCreators } from "../../checkout-page/store";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const initializeCartAction = async (dispatch) => {
  try {
    const response = await axios.get(serverBaseUrl + "/api/cart/items");
    const { result } = response.data;
    var cartItemsCount = 0;
    var cartSubtotal = 0;
    result.forEach((element) => {
      cartItemsCount += element.addToCart;
      cartSubtotal += element.payAmount;
    });
    dispatch({ type: actionTypes.GET_CART_ITEMS, value: fromJS(result) });
    dispatch({
      type: actionTypes.CART_ITEMS_COUNT,
      value: fromJS(cartItemsCount),
    });
    dispatch({
      type: actionTypes.CART_SUBTOTAL,
      value: fromJS(Number(cartSubtotal.toFixed(2))),
    });
  } catch (error) {
    console.log(error);
    const { msg } = error.response.data;
    message.error(msg);
  }
};

export const removeFromCartAction = (record_id, solid_id, type, addToCart) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        serverBaseUrl + "/api/cart/remove_item",
        { record_id, solid_id, type, addToCart }
      );
      const { msg } = response.data;
      message.success(msg);
      dispatch(actionCreators.getAllItemsAction)
      dispatch(initializeCartAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};
