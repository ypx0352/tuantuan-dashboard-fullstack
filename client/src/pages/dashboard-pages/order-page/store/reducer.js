import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  originalOrder: {
    package_id: "",
    package_weight: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    item_count: "",
    item_type: "",
    items: [],
  },
  spinning: false,
  exchangeRate: "",
  exchangeRateSpinning: false
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.INITIAL_ORDER:
      return state.set("originalOrder", action.value);

    case actionTypes.SPINNING:
      return state.set("spinning", action.value);

    case actionTypes.RESET_ORDER:
      return state.set("originalOrder", defaultState.get("originalOrder"));

    case actionTypes.EXCHANGE_RATE:
      return state.set("exchangeRate", action.value);

    case actionTypes.EXCHANGE_RATE_SPINNING:
      return state.set("exchangeRateSpinning", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
