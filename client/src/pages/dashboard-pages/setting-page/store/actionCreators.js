import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";


export const getSettingsAction = async (dispatch) => {
  generalHandle(async () => {
    const settings = {};
    const response = await authAxios.get("/api/setting");
    const { result } = response.data;
    result.forEach((item) => {
      settings[`${item.name}`] = {
        value: item.value,
        updatedAt: item.updatedAt,
      };
    });
    dispatch({ type: actionTypes.GET_SETTINGS, value: fromJS(settings) });
  });
};

export const updateSettingAction = (name, value) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.put("/api/setting", {
        name,
        value,
      });
      const { msg } = response.data;
      message.success(msg);
      dispatch(getSettingsAction);
    });
  };
};
