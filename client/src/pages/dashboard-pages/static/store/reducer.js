import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  showCart: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_SHOW_CART:
      return state.set("showCart", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
