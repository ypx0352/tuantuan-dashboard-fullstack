import { fromJS } from "immutable";
import { message } from "antd";
import { actionTypes } from ".";
import { actionTypes as registerActionTypes } from "../../register-page/store";
import { generalHandle } from "../../general-handler/errorHandler";
import { normalAxios } from "../../general-handler/requestHandler";


export const loginAction = (loginInfo) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        const response = await normalAxios.post("/api/login", loginInfo);
        const { msg, token, name, role } = response.data;
        message.success(msg);

        // Save token,name and admin to local storage
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("role", role);
        dispatch({ type: actionTypes.LOGIN_SUCCESS });
      },
      dispatch,
      (dispatch, error) => {
        const { errorObject } = error.response.data;
        if (errorObject !== undefined) {
          dispatch({
            type: registerActionTypes.INPUT_ERROR_OBJECT,
            value: fromJS(errorObject),
          });
        }
      }
    );
  };
};
