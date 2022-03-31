import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  showCart: false,
  cartItems: [],
  cartItemsCount: 0,
  cartSubtotal: 0,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_SHOW_CART:
      return state.set("showCart", action.value);

    case actionTypes.GET_CART_ITEMS:
      return state.set("cartItems", action.value);

    case actionTypes.CART_ITEMS_COUNT:
      return state.set("cartItemsCount", action.value);

    case actionTypes.CART_SUBTOTAL:
      return state.set("cartSubtotal", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
