import { fromJS } from "immutable";
import { actionTypes } from ".";

export const showPassword = (showPassword) => ({
  type: actionTypes.SHOW_PASSWORD,
  value: fromJS(showPassword),
});
