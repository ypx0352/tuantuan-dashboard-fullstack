import { message } from "antd";
import axios from "axios";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const initializeAddressAction = async (dispatch) => {
  try {
    const response = await axios.get(
      serverBaseUrl + "/api/address/all_address"
    );

    const allAddress = response.data.result.map((item) => {
      const newItem = item;
      newItem.createdAtLocale = new Date(item.createdAt).toLocaleString();
      newItem.key = item._id;
      return newItem;
    });

    dispatch({
      type: actionTypes.INITIALIZE_ADDRESS,
      value: fromJS(allAddress),
    });

    dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
  } catch (error) {
    console.log(error);
  }
};

export const submitNewAddressAction = (address) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        serverBaseUrl + "/api/address/add",
        address
      );
      const { msg } = response.data;
      message.success(msg);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};
