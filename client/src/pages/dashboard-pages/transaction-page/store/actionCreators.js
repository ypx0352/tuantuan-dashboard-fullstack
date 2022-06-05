import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const initializeAllTransactionsAction = async (dispatch) => {
  generalHandle(
    async () => {
      const response = await authAxios.get("/api/transaction/all");
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
    },
    dispatch,
    () => {
      dispatch({ type: actionTypes.TABLE_LOADING, value: fromJS(false) });
    }
  );
};

export const approveTransactionAction = (transaction_id) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.put("/api/transaction/approve", {
        transaction_id,
      });
      message.success(response.data.msg);
      dispatch(initializeAllTransactionsAction);
    });
  };
};
