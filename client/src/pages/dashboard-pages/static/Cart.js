import { fromJS } from "immutable";
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { actionTypes } from "./store";

const CartContainer = styled.div`
  @keyframes display_cart {
    from {
      height: 0;
    }
    to {
      height: 500px;
    }
  }

  display: flex;
  flex-direction: column;
  height: 500px;
  background-color: #363740;
  animation-name: display_cart;
  animation-duration: 2s;
  &.hide {
    display: none;
  }
`;

const Close = styled.div`
  display: flex;
  justify-content: flex-end;
  color: white;
  padding: 10px;
  cursor: pointer;
`;

const Cart = (props) => {
  const { setShowCart } = props;

  return (
    <CartContainer className={props.className}>
      <Close onClick={() => setShowCart(false)}>
        <span class="material-icons-outlined">close</span>
      </Close>
    </CartContainer>
  );
};

const mapState = (state) => ({});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },
});

export default connect(mapState, mapDispatch)(Cart);
