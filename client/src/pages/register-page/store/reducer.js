import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  showPassword: false,
  inputErrorObject: {},
  login:false
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_PASSWORD:
      return state.set("showPassword", action.value);

    case actionTypes.INPUT_ERROR_OBJECT:
      return state.set("inputErrorObject", action.value);

    case actionTypes.MODIFY_INPUT_ERROR_OBJECT:
      return state.set("inputErrorObject", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
