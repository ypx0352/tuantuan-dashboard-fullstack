import { message } from "antd";
import axios from "axios";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const searchPackageAction = (pk_id) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SET_TABLE_SPINNING, value: fromJS(true) });
    try {
      const response = await axios.get(
        serverBaseUrl + `/api/package/?pk_id=${pk_id}`
      );
      const { itemRecords, packageRecord, trackRecords } = response.data;

      packageRecord.sendTimeLocale = new Date(
        packageRecord.sendTimeISO
      ).toLocaleString();
      const { receiver, phone, address, ...rest } = packageRecord;
      dispatch({
        type: actionTypes.SET_TABLE_DATA,
        value: fromJS({
          packageData: [{ ...rest }],
          receiverData: [{ receiver, phone, address }],
          itemData: itemRecords,
          trackData: trackRecords,
        }),
      });
      dispatch({ type: actionTypes.SHOW_TABLES, value: fromJS(true) });
      dispatch({ type: actionTypes.SET_TABLE_SPINNING, value: fromJS(false) });
    } catch (error) {
      console.log(error);
      message.error(error.response.data.msg);
      dispatch({ type: actionTypes.SET_TABLE_SPINNING, value: fromJS(false) });
    }
  };
};

export const getLatestPackagesAction = (limit) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.LATEST_PACKAGES_SPINNING,
        value: fromJS(true),
      });
      const response = await axios.get(
        serverBaseUrl + `/api/package/latest_package?limit=${limit}`
      );
      dispatch({
        type: actionTypes.LATEST_PACKAGES,
        value: fromJS(response.data.result),
      });
      dispatch({
        type: actionTypes.LATEST_PACKAGES_SPINNING,
        value: fromJS(false),
      });
    } catch (error) {
      console.log(error);
      message.error(error.response.data.msg);
    }
  };
};
