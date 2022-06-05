import { message } from "antd";

const generalHandle = async (action, dispatch, postErrorAction) => {
  try {
    await action();
  } catch (error) {
    postErrorAction && postErrorAction(dispatch, error);
    if (error.response) {
      message.warn(error.response.data.msg);
    } else {
      message.warn("Oops, something wrong.");
    }
  }
};

export { generalHandle };
