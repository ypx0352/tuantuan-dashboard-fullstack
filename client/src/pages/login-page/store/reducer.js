import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  showPassword: false,
  login: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_PASSWORD:
      return state.set("showPassword", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
