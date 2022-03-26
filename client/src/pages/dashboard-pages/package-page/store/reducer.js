import { fromJS } from "immutable";

const defaultState = fromJS({
  test: "123",
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default returnNewStateToStore;
