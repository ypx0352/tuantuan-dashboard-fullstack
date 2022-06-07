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

export const getPostSlipUrlAction = (pk_id) => {
  return async (dispatch) => {
    const response = await authAxios.get(
      `/api/package/post_slip?pk_id=${pk_id}`,
      { responseType: "blob" }
    );

    // var fileURL = window.URL.createObjectURL(new Blob([response.data]));
    // var fileLink = document.createElement("a");

    // fileLink.href = fileURL;
    // fileLink.setAttribute("download", "file.pdf");
    // document.body.appendChild(fileLink);

    // fileLink.click();

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = window.URL.createObjectURL(file);
    console.log(response);
    window.open(fileURL);
    //window.open("data:application/pdf," + encodeURI(response.data));
  };
};
