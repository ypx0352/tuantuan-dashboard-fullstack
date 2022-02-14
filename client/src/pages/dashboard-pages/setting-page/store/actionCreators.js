import { message } from "antd";
import axios, { Axios } from "axios";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const getSettingsAction = async (dispatch) => {
  const settings = {};
  try {
    const response = await axios.get(serverBaseUrl + "/api/setting");
    const { result } = response.data;
    result.forEach((item) => {
      settings[`${item.name}`] = {
        value: item.value,
        updatedAt: item.updatedAt,
      };
    });
    dispatch({ type: actionTypes.GET_SETTINGS, value: fromJS(settings) });
  } catch (error) {
    console.log(error);
    const { msg } = error.response.data;
    message.error(msg);
  }
};

export const updateSettingAction = (name, value) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(serverBaseUrl + "/api/setting", {
        name,
        value,
      });
      const { msg } = response.data;
      message.success(msg);
      dispatch(getSettingsAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};
