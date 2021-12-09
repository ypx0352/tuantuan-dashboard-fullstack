import axios from "axios";
import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";

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
        `http://localhost:1100/api/order/${pk_id.trim()}`
      );
      console.log(response.data);
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
