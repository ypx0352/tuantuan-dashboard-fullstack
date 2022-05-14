import { message } from "antd";
import axios from "axios";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const getAllLogsAction = async (dispatch) => {
  try {
    dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(true) });
    const response = await axios.get(serverBaseUrl + "/api/log/all_logs");
    const rawResult = response.data.result;
    const result = rawResult.map((item) => {
      const { createdAt, ...rest } = item;
      const createdAtLocale = new Date(createdAt).toLocaleString();
      return { createdAtLocale, ...rest };
    });
    dispatch({
      type: actionTypes.ALL_LOGS,
      value: fromJS(result),
    });
    dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
    const { msg } = error.response.data;
    message.error(msg);
  }
};
