import axios from "axios";
import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const searchAction = (pk_id) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.SPINNING,
      value: fromJS(true),
    });

    dispatch({
      type: actionTypes.RESET_ORDER,
    });

    try {
      const response = await axios.get(
        serverBaseUrl+`/api/order/${pk_id.trim()}`
      );
      const { result } = response.data;

      dispatch({
        type: actionTypes.INITIAL_ORDER,
        value: fromJS(result),
      });

      dispatch({
        type: actionTypes.SPINNING,
        value: fromJS(false),
      });
    } catch (error) {
      const { msg } = error.response.data;
      message.warning(msg);

      dispatch({
        type: actionTypes.SPINNING,
        value: fromJS(false),
      });
    }
  };
};

export const initializeExchangeRateAction = async (dispatch) => {
  dispatch({ type: actionTypes.EXCHANGE_RATE_SPINNING, value: fromJS(true) });
  try {
    const response = await axios.get(
      serverBaseUrl +'/api/order/tools/exchange_rate'
    );
    const { result } = response.data;
    dispatch({ type: actionTypes.EXCHANGE_RATE, value: fromJS(result) });
    dispatch({
      type: actionTypes.EXCHANGE_RATE_SPINNING,
      value: fromJS(false),
    });
  } catch (error) {
    const { msg } = error.response.data;
    message.warning(msg);
    dispatch({
      type: actionTypes.EXCHANGE_RATE_SPINNING,
      value: fromJS(false),
    });
  }
};
