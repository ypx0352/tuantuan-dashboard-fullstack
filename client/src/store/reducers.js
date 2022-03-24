import { combineReducers } from "redux-immutable";
import { reducer as loginReducer } from "../pages/login-page/store/index";
import { reducer as registerReducer } from "../pages/register-page/store";
import { reducer as orderReducer } from "../pages/dashboard-pages/order-page/store";
import { reducer as checkoutReducer } from "../pages/dashboard-pages/checkout-page/store";
import { reducer as staticReducer } from "../pages/dashboard-pages/static/store";
import { reducer as settingReducer } from "../pages/dashboard-pages/setting-page/store";
import { reducer as addressReducer } from "../pages/dashboard-pages/address-page/store";

const reducers = combineReducers({
  login: loginReducer,
  register: registerReducer,
  order: orderReducer,
  checkout: checkoutReducer,
  static: staticReducer,
  setting: settingReducer,
  address: addressReducer,
});

export default reducers;
