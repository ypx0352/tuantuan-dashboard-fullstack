import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  allItems: { sold: null, stock: null, employee: null, exception: null },
  itemsCount: {
    soldCount: null,
    stockCount: null,
    employeeCount: null,
    exceptionCount: null,
  },
  countSpinning: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.COUNT_SPINNING:
      return state.set("countSpinning", action.value);

    case actionTypes.SET_ALL_ITEMS:
      return state.set("allItems", action.value);

    case actionTypes.SET_ITEMS_COUNT:
      return state.set("itemsCount", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
