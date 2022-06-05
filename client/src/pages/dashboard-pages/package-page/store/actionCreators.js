import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const searchPackageAction = (pk_id) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        dispatch({ type: actionTypes.SET_TABLE_SPINNING, value: fromJS(true) });
        const response = await authAxios.get(`/api/package/?pk_id=${pk_id}`);
        const { itemRecords, packageRecord, trackRecords } = response.data;
        packageRecord.sendTimeLocale = new Date(
          packageRecord.sendTimeISO
        ).toLocaleString();
        const { receiver, phone, address, ...rest } = packageRecord;
        const { domesticCourier, domesticParcelID, status } = trackRecords;
        dispatch({
          type: actionTypes.SET_TABLE_DATA,
          value: fromJS({
            packageData: [
              { domesticCourier, domesticParcelID, status, ...rest },
            ],
            receiverData: [{ receiver, phone, address }],
            itemData: itemRecords,
            trackData: trackRecords.trackInfo,
          }),
        });
        dispatch({ type: actionTypes.SHOW_TABLES, value: fromJS(true) });
        dispatch({
          type: actionTypes.SET_TABLE_SPINNING,
          value: fromJS(false),
        });
      },
      dispatch,
      () => {
        dispatch({
          type: actionTypes.SET_TABLE_SPINNING,
          value: fromJS(false),
        });
        dispatch({ type: actionTypes.SHOW_TABLES, value: fromJS(false) });
      }
    );
  };
};

export const getLatestPackagesAction = (limit) => {
  return async (dispatch) => {
    generalHandle(async () => {
      dispatch({
        type: actionTypes.LATEST_PACKAGES_SPINNING,
        value: fromJS(true),
      });
      const response = await authAxios.get(
        `/api/package/latest_package?limit=${limit}`
      );
      dispatch({
        type: actionTypes.LATEST_PACKAGES,
        value: fromJS(response.data.result),
      });
      dispatch({
        type: actionTypes.LATEST_PACKAGES_SPINNING,
        value: fromJS(false),
      });
    });
  };
};
