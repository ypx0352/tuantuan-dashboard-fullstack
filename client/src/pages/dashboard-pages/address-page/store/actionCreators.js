import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const initializeAddressAction = async (dispatch) => {
  generalHandle(
    async () => {
      dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(true) });
      const response = await authAxios.get("/api/address/all_address");
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
    },
    dispatch,
    () => dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) })
  );

  // try {
  //   dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(true) });
  //   const response = await authAxios.get("/api/address/all_address");
  //   const allAddress = response.data.result.map((item) => {
  //     const newItem = item;
  //     newItem.createdAtLocale = new Date(item.createdAt).toLocaleString();
  //     newItem.key = item._id;
  //     return newItem;
  //   });

  //   dispatch({
  //     type: actionTypes.INITIALIZE_ADDRESS1,
  //     value: fromJS(allAddress),
  //   });

  //   dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
  // } catch (error) {
  //   console.log(error);
  // }
};

export const submitNewAddressAction = (address) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.post("/api/address/add", address);
      const { msg } = response.data;
      message.success(msg);
      dispatch(initializeAddressAction);
    });

    try {
      const response = await authAxios.post("/api/address/add", address);
      const { msg } = response.data;
      message.success(msg);
      dispatch(initializeAddressAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const deleteAddressAction = (_id) => {
  return async (dispatch) => {
    try {
      const response = await authAxios.delete("/api/address/delete", {
        data: { _id },
      });
      message.success(response.data.msg);
      dispatch(initializeAddressAction);
    } catch (error) {
      console.log(error);
      message.error(error.response.data.msg);
    }
  };
};

export const updateAddressAction = (updatedAddress) => {
  return async (dispatch) => {
    const { name, phone, province, city, district, address, note, _id } =
      updatedAddress;
    const newAddress = {
      name,
      phone,
      province,
      city,
      district,
      address,
      note,
      _id,
    };

    try {
      const response = await authAxios.put("/api/address/update", newAddress);
      message.success(response.data.msg);
      dispatch(initializeAddressAction);
      dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(false) });
    } catch (error) {
      console.log(error);
      message.error(error.response.data.msg);
    }
  };
};
