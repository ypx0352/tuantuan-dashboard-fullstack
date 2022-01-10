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
        serverBaseUrl + `/api/order/${pk_id.trim()}`
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
      console.log(error);
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
      serverBaseUrl + "/api/order/tools/exchange_rate"
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

export const submitTableDataAction = (tableData) => {
  return async (dispatch) => {
    // input validation
    try {
      if (tableData.items.length === 0) {
        throw new Error("error");
      } else {
        tableData.items.forEach((element) => {
          const { item, qty, price, weight, cost } = element;
          if (qty * price * weight * cost === 0 || item.length === 0) {
            throw new Error("error");
          }
        });
      }

      dispatch({
        type: actionTypes.SHOW_CONFIRMATION,
        value: fromJS(true),
      });

      dispatch({
        type: actionTypes.CONFIRMATION_SPINNING,
        value: fromJS(true),
      });

      try {
        const response = await axios.post(
          serverBaseUrl + "/api/order/submit",
          tableData
        );

        dispatch({
          type: actionTypes.CONFIRMATION_DATA,
          value: fromJS(response.data),
        });

        dispatch({
          type: actionTypes.CONFIRMATION_SPINNING,
          value: fromJS(false),
        });
      } catch (error) {
        dispatch({
          type: actionTypes.CONFIRMATION_SPINNING,
          value: fromJS(false),
        });
        console.log(error);
        const { msg } = error.response.data;
        message.warning(msg);
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SHOW_CONFIRMATION,
        value: fromJS(false),
      });
      message.warning("Input is not completed.");
    }
  };
};

export const saveConfirmationDataAction = (confirmationData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        serverBaseUrl + "/api/order/confirm",
        confirmationData
      );
      // TODO need a customised alert and reset data
      const { msg } = response.data;
      message.success(msg);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.warning(msg);
    }
  };
};
