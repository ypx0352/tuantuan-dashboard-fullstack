import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  allAddress: [],
  addFormDisplayed: false,
  tableSpinning: true,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ADD_FORM:
      return state.set("addFormDisplayed", action.value);

    case actionTypes.INITIALIZE_ADDRESS:
      return state.set("allAddress", action.value);

    case actionTypes.TABLE_SPINNING:
      return state.set("tableSpinning", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
