import { message } from "antd";

const generalHandle = async (action, dispatch, postErrorAction) => {
  try {
    await action();
  } catch (error) {
    postErrorAction && postErrorAction(dispatch, error);
    console.log(error);
    if (error.response?.data?.msg !== undefined) {
      message.warn(error.response.data.msg);
    } else {
      message.warn("Oops, something wrong.");
    }
  }
};

export { generalHandle };
