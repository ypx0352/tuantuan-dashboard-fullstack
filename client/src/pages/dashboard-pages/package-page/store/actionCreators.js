import axios from "axios";
import { fromJS } from "immutable";
import { actionTypes } from ".";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const searchPackageAction = (pk_id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        serverBaseUrl + `/api/package/?pk_id=${pk_id}`
      );
      const { itemRecords, packageRecord } = response.data;
      console.log(itemRecords, packageRecord);
      const { receiver, phone, address, ...rest } = packageRecord;
      dispatch({
        type: actionTypes.SET_TABLE_DATA,
        value: fromJS({
          packageData: [{ ...rest }],
          receiverData: [{ receiver, phone, address }],
          itemData: itemRecords,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };
};
