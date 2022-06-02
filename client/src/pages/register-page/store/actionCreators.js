import { fromJS } from "immutable";
import { message } from "antd";
import { actionTypes } from ".";
import { normalAxios } from "../../general-handler/requestHandler";
import { generalHandle } from "../../general-handler/errorHandler";

export const submitRegisterAction = (registerInfo) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        const response = await normalAxios.post("/api/register", registerInfo);
        message.success(response.data.msg);
        dispatch({ type: actionTypes.REGISTERED_SUCCESS });
      },
      dispatch,
      (dispatch, error) => {
        const { errorObject } = error.response.data;
        if (errorObject !== undefined) {
          dispatch({
            type: actionTypes.INPUT_ERROR_OBJECT,
            value: fromJS(errorObject),
          });
        }
      }
    );
  };
};
