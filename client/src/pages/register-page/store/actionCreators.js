import { fromJS } from "immutable";
import axios from "axios";
import { message } from "antd";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const showPassword = (showPassword) => ({
  type: actionTypes.SHOW_PASSWORD,
  value: fromJS(showPassword),
});

export const submitRegisterAction = (registerInfo) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        serverBaseUrl + "/api/register",
        registerInfo
      );
      message.success(response.data.msg);
    } catch (error) {
      console.log(error);
      const { errorObject, msg } = error.response.data;

      if (errorObject !== undefined) {
        dispatch({
          type: actionTypes.INPUT_ERROR_OBJECT,
          value: fromJS(errorObject),
        });
      }

      if (msg !== undefined) {
        message.warn(msg);
      }
    }
  };
};
