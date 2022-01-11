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
  submitLoading: false,
  showConfirmation: false,
  confirmationSpinning: false,
  confirmationData: {
    pk_id: "",
    sold: [],
    stock: [],
    employee: [],
  },
  confirmLoading: false,
  showConfirmationResultDialog: false,
  confirmResult: { title: "Result", msg: "Loading" },
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

    case actionTypes.SUBMIT_LOADING:
      return state.set("submitLoading", action.value);

    case actionTypes.SHOW_CONFIRMATION:
      return state.set("showConfirmation", action.value);

    case actionTypes.CONFIRMATION_SPINNING:
      return state.set("confirmationSpinning", action.value);

    case actionTypes.CONFIRMATION_DATA:
      return state.set("confirmationData", action.value);

    case actionTypes.CONFIRM_LOADING:
      return state.set("confirmLoading", action.value);

    case actionTypes.SHOW_CONFIRMATION_RESULT_DIALOG:
      return state.set("showConfirmationResultDialog", action.value);

    case actionTypes.RESET_ORDER_STORE:
      const newState = defaultState.toJS();
      newState.exchangeRate = state.get("exchangeRate");
      return fromJS(newState);

    case actionTypes.CONFIRM_RESULT:
      return state.set("confirmResult", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
