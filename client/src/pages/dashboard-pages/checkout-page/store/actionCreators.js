import { fromJS } from "immutable";
import { actionTypes } from ".";
import axios from "axios";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const getItemsCountAction = async (dispatch) => {
  dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(true) });
  try {
    const response = await axios.get(serverBaseUrl + "/api/checkout/count");

    dispatch({
      type: actionTypes.SET_ITEMS_COUNT,
      value: fromJS(response.data.result),
    });
    dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(false) });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(false) });
  }
};
