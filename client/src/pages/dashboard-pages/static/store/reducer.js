import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  showCart: false,
  cartItems: [
    { item: "B.Box 餐具套装 2件套", qty: 1, subtotal: 99.98 },
    { item: "B.Box 3件套", qty: 2, subtotal: 199.98 },
  ],
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
