import { message } from "antd";
import axios from "axios";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const initializeAllTransactionsAction = async (dispatch) => {
  try {
    const response = await axios.get(serverBaseUrl + "/api/transaction/all");

    // Convert ISO time to local time.
    response.data.result.forEach(
      (item) =>
        (item.createdAtLocale = new Date(item.createdAt).toLocaleString())
    );

    dispatch({
      type: actionTypes.SET_ALL_TRANSACTIONS,
      value: fromJS(response.data.result),
    });

    dispatch({ type: actionTypes.TABLE_LOADING, value: fromJS(false) });
  } catch (error) {
    console.log(error);
    message.error(error.response.data.msg);
  }
};

export const approveTransactionAction = (transaction_id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        serverBaseUrl + "/api/transaction/approve",
        { transaction_id }
      );

      message.success(response.data.msg);
      dispatch(initializeAllTransactionsAction);
    } catch (error) {
      console.log(error);
      message.error(error.response.data.msg);
    }
  };
};
