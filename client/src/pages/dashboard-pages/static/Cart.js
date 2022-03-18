import { fromJS } from "immutable";
import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Empty } from "antd";
import { actionCreators, actionTypes } from "./store";


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

const Items = styled.div`
  height: 40%;
  overflow: auto;
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
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  display: flex;
  position: absolute;
  bottom: 25px;
  right: 15px;
  flex-direction: column;
  color: #bcbbb4;
  animation: fadeIn 2s ease-in;
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
  const { setShowCart, cartItems, initializeCart, cartSubtotal, handleRemove } =
    props;

  useEffect(() => {
    initializeCart();
  }, []);

  const getCartItem = () => {
    return cartItems.map((item, index) => {
      return (
        <Record key={index}>
          <span style={{ width: "50%" }}>{item.get("item")}</span>
          <span style={{ width: "23%" }}>{item.get("addToCart")}</span>
          <Remove
            className="remove"
            style={{ width: "20%" }}
            onClick={() => handleRemove(item.get("_id"))}
          >
            Remove
          </Remove>
          <span style={{ width: "7%" }}>￥ {item.get("payAmount")}</span>
        </Record>
      );
    });
  };

  return (
    <CartContainer className={props.className}>
      <Header>
        <span style={{ width: "50%" }}>Item</span>
        <span style={{ width: "48%" }}>Quantity</span>
        <span
          className="material-icons-outlined"
          onClick={() => setShowCart(false)}
          style={{ cursor: "pointer" }}
        >
          close
        </span>
      </Header>
      {cartItems.size === 0 ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: "50%",
            marginTop: "10%",
          }}
          style={{ color: "#bcbbb4" }}
          description={<span>Your cart is empty</span>}
        />
      ) : (
        <Items>{getCartItem()}</Items>
      )}

      {cartItems.size === 0 ? (
        ""
      ) : (
        <CartSummary>
          <Subtotal>
            <span style={{ fontSize: "15px" }}>Subtotal</span>
            <span style={{ fontSize: "25px" }}>￥ {cartSubtotal}</span>
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
      )}
    </CartContainer>
  );
};

const mapState = (state) => ({
  cartItems: state.getIn(["static", "cartItems"]),
  cartSubtotal: state.getIn(["static", "cartSubtotal"]),
});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },

  initializeCart() {
    dispatch(actionCreators.initializeCartAction);
  },

  handleRemove(value) {
    dispatch(actionCreators.removeFromCartAction(value));
  },
});

export default connect(mapState, mapDispatch)(Cart);
