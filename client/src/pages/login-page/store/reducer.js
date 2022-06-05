import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  loginSuccess: -1, // -1=undefined
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return state.set("loginSuccess", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
