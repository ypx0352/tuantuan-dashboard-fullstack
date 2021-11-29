import { combineReducers } from "redux-immutable";
import { reducer as loginReducer } from "../pages/login-page/store/index";
import { reducer as registerReducer } from "../pages/register-page/store";

const reducers = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export default reducers;
