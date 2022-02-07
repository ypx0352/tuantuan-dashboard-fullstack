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
      height: 50%;
    }
  }

  display: flex;
  position: relative;
  flex-direction: column;
  height: 50%;
  background-color: #363740;
  padding: 20px;
  animation-name: display_cart;
  animation-duration: 1s;
  &.hide {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: #bcbbb4;
  font-weight: bold;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 254, 242, 0.1);
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #bcbbb4;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 254, 242, 0.1);
  :hover {
    border-bottom: 0.1px solid white;
    .remove {
      visibility: visible;
    }
  }
`;

const Remove = styled.span`
  visibility: hidden;
  cursor: pointer;
`;

const CartSummary = styled.div`
  display: flex;
  position: absolute;
  bottom: 25px;
  right: 15px;
  flex-direction: column;
  color: #bcbbb4;
`;

const Subtotal = styled.div`
  display: flex;
  width: 480px;
  justify-content: space-between;
  align-items: baseline;
`;

const Button = styled.button`
  width: 480px;
  box-sizing: border-box;
  padding: 21px 23px;
  border: 1px solid rgb(234, 234, 223);
  color: #212121;
  font-size: 14px;
  margin-top: 20px;
  cursor: pointer;
`;

const CompanyLogo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-top: 15px;
`;

const Cart = (props) => {
  const { setShowCart, cartItems } = props;

  const getCartItem = () => {
    return cartItems.map((item) => {
      return (
        <Record key={item.get("item")}>
          <span style={{ width: "50%" }}>{item.get("item")}</span>
          <span style={{ width: "23%" }}>{item.get("qty")}</span>
          <Remove className="remove" style={{ width: "20%" }}>
            Remove
          </Remove>
          <span style={{ width: "7%" }}>￥ {item.get("subtotal")}</span>
        </Record>
      );
    });
  };

  return (
    <CartContainer className={props.className}>
      <Header>
        <span style={{ width: "50%" }}>Cart</span>
        <span style={{ width: "48%" }}>Quantity</span>
        <span
          className="material-icons-outlined"
          onClick={() => setShowCart(false)}
          style={{ cursor: "pointer" }}
        >
          close
        </span>
      </Header>
      {getCartItem()}

      <CartSummary>
        <Subtotal>
          <span style={{ fontSize: "15px" }}>Subtotal</span>
          <span style={{ fontSize: "25px" }}> ￥160.00</span>
        </Subtotal>
        <Button>Checkout</Button>
        <CompanyLogo>
          <span
            className="iconfont icon-zhifubaozhifu-copy-copy"
            style={{ marginRight: "10px" }}
          ></span>
          <span className="iconfont icon-weixinzhifu1-copy-copy"> </span>
        </CompanyLogo>
      </CartSummary>
    </CartContainer>
  );
};

const mapState = (state) => ({
  cartItems: state.getIn(["static", "cartItems"]),
});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },
});

export default connect(mapState, mapDispatch)(Cart);
