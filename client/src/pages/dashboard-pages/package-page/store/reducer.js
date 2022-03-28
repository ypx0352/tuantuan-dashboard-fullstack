import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  tableData: {},
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_TABLE_DATA:
      return state.set("tableData", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
