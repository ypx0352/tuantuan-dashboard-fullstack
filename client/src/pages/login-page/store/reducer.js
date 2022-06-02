import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  login: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return state.set("login", fromJS(true));

    default:
      return state;
  }
};

export default returnNewStateToStore;
