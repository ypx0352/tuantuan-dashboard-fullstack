import { combineReducers } from "redux-immutable";
import { reducer as loginReducer } from "../pages/login-page/store/index";
import { reducer as registerReducer } from "../pages/register-page/store";
import { reducer as orderReducer } from "../pages/dashboard-pages/order-page/store";
import { reducer as checkoutReducer } from "../pages/dashboard-pages/checkout-page/store";

const reducers = combineReducers({
  login: loginReducer,
  register: registerReducer,
  order: orderReducer,
  checkout: checkoutReducer,
});

export default reducers;
