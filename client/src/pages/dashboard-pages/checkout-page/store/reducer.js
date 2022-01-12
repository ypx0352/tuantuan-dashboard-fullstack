import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  itemsCount: {
    sold: null,
    stock: null,
    employee: null,
    exception: null,
  },
  countSpinning: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.COUNT_SPINNING:
      return state.set("countSpinning", action.value);

    case actionTypes.SET_ITEMS_COUNT:
      console.log(action.value);
      return state.set("itemsCount", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
