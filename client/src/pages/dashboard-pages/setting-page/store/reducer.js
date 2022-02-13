import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  settings: {
    normalPostage: { value: "loading...", updatedAt: "loading..." },
    babyFormulaPostage: { value: "loading...", updatedAt: "loading..." },
    exchangeRateInSetting: { value: "loading", updatedAt: "loading..." },
  },
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_SETTINGS:
      return state.set("settings", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
