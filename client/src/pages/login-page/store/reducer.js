import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  showPassword: false,
  user: { login: false, name: "", admin: false },
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_PASSWORD:
      return state.set("showPassword", action.value);

    case actionTypes.LOGIN_SUCCESS:
      return state.set("user", {
        login: true,
        name: action.value.get("name"),
        admin: action.value.get("admin"),
      });

    default:
      return state;
  }
};

export default returnNewStateToStore;
