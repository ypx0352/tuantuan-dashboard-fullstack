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
  exchangeRateSpinning: false,
  showConfirmation:false,
  confirmationSpinning: false,
  confirmationData: {
    sold: [],
    stock: [],
    employee: [],
  },
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

      case actionTypes.SHOW_CONFIRMATION:
        return state.set('showConfirmation', action.value)

    case actionTypes.CONFIRMATION_SPINNING:
      return state.set("confirmationSpinning", action.value);

    case actionTypes.CONFIRMATION_DATA:
      return state.set("confirmationData", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
