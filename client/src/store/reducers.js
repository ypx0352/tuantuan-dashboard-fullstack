import { combineReducers } from "redux-immutable";
import { reducer as loginReducer } from "../pages/login-page/store/index";
import { reducer as registerReducer } from "../pages/register-page/store";
import { reducer as orderReducer } from "../pages/dashboard-pages/order-page/store";
import { reducer as checkoutReducer } from "../pages/dashboard-pages/checkout-page/store";
import { reducer as staticReducer } from "../pages/dashboard-pages/static/store";
import { reducer as settingReducer } from "../pages/dashboard-pages/setting-page/store";
import { reducer as addressReducer } from "../pages/dashboard-pages/address-page/store";
import { reducer as packageReducer } from "../pages/dashboard-pages/package-page/store";
import { reducer as logReducer } from "../pages/dashboard-pages/log-page/store";
import { reducer as transactionReducer } from "../pages/dashboard-pages/transaction-page/store";

const reducers = combineReducers({
  login: loginReducer,
  register: registerReducer,
  order: orderReducer,
  checkout: checkoutReducer,
  static: staticReducer,
  setting: settingReducer,
  address: addressReducer,
  package: packageReducer,
  log: logReducer,
  transaction: transactionReducer,
});

export default reducers;
