import axios from "axios";
import { fromJS } from "immutable";
import { message } from "antd";
import { actionTypes } from ".";
import { actionTypes as registerActionTypes } from "../../register-page/store";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const showPassword = (showPassword) => ({
  type: actionTypes.SHOW_PASSWORD,
  value: fromJS(showPassword),
});

export const loginAction = (loginInfo) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        serverBaseUrl + "/api/login",
        loginInfo
      );
      const { msg, token, name,admin } = response.data;
      message.success(msg);
      // Save token to local storage
      localStorage.setItem("user", response.data);
      dispatch({type:actionTypes.LOGIN_SUCCESS, value:fromJS({name,admin})});
          
    } catch (error) {
      console.log(error);
      const { errorObject, msg } = error.response.data;

      if (errorObject !== undefined) {
        dispatch({
          type: registerActionTypes.INPUT_ERROR_OBJECT,
          value: fromJS(errorObject),
        });
      }

      if (msg !== undefined) {
        message.warn(msg);
      }
    }
  };
};
