import { fromJS } from "immutable";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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
      height: 70vh;
    }
  }

  display: flex;
  position: relative;
  flex-direction: column;
  height: 70vh;
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
  justify-content: flex-start;
  color: #bcbbb4;
  font-weight: bold;
  padding: 15px;
  border-bottom: 2px solid rgba(255, 254, 242, 0.1);
`;

const Items = styled.div`
  height: 70%;
  overflow: auto;
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #bcbbb4;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 254, 242, 0.1);
  :hover {
    border-bottom: 0.1px solid white;
    .remove {
      display: inline;
    }
    .payAmountToSender {
      display: none;
    }
    .allProfits {
      display: inline;
    }
  }
`;

const Remove = styled.span`
  display: none;
  color: red;
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
  bottom: 10px;
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
const colors = {
  stock: "sandybrown",
  employee: "#18a16d",
  exception: "#DF362D",
  allProfitsNotSelected: "#EC8FD0",
  allProfitsSelected: "#D43790",
};
const Tag = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  box-sizing: border-box;
  padding: 2px 5px;
  border-radius: 10px;
  color: white;
  &.allProfits {
    display: none;
    cursor: pointer;
  }
  &.keep {
    display: inline;
  }
  &.hide {
    display: none;
  }
`;

const Cart = (props) => {
  const {
    setShowCart,
    cartItems,
    initializeCart,
    cartSubtotal,
    handleRemove,
    handleSetReturnAllProfitsItem,
  } = props;

  useEffect(() => {
    initializeCart();
  }, []);

  const generateCartItem = () => {
    return cartItems.map((item, index) => {
      return (
        <Record key={index}>
          <span style={{ width: "35%" }}>
            {item.get("item") + " "}
            {item.get("originalType") !== "sold" ? (
              <Tag type={item.get("originalType")}>
                {item.get("originalType")}
              </Tag>
            ) : (
              ""
            )}
            <Tag
              type={
                item.get("returnAllProfits")
                  ? "allProfitsSelected"
                  : "allProfitsNotSelected"
              }
              className={
                ["employee", "exception"].includes(item.get("originalType"))
                  ? "hide"
                  : item.get("returnAllProfits")
                  ? "keep allProfits"
                  : "allProfits"
              }
              onClick={() =>
                handleSetReturnAllProfitsItem(
                  item.get("_id"),
                  !item.get("returnAllProfits")
                )
              }
            >
              All profits
            </Tag>
          </span>
          <span style={{ width: "10%" }}>{item.get("qty")}</span>
          <span style={{ width: "15%" }}>
            <span>{item.get("receiver")} </span>

            <Link
              to={`/dashboard/package/?pk_id=${item.get("pk_id")}`}
              target="_blank"
            >
              {item.get("pk_id")}
            </Link>
          </span>

          <span style={{ width: "10%" }}>
            {item.get("originalType") === "employee"
              ? "————"
              : `￥${item.get("payAmountFromCustomer")}`}
          </span>
          <span style={{ width: "10%" }}>
            {item.get("originalType") === "employee"
              ? "———— "
              : `￥${item.get("profits")}`}
          </span>
          <span style={{ width: "15%" }}>{item.get("note")}</span>
          <span style={{ width: "5%" }} className="payAmountToSender">
            ￥ {item.get("payAmountToSender")}
          </span>
          <Remove
            className="remove"
            style={{ width: "5%" }}
            onClick={() =>
              handleRemove(
                item.get("_id"),
                item.get("original_id"),
                item.get("originalType"),
                item.get("qty")
              )
            }
          >
            Remove
          </Remove>
        </Record>
      );
    });
  };

  return (
    <CartContainer className={props.className}>
      <Header>
        <span style={{ width: "35%" }}>Item</span>
        <span style={{ width: "10%" }}>Quantity</span>
        <span style={{ width: "15%" }}>Receiver</span>
        <span style={{ width: "10%" }}>Customer pay</span>
        <span style={{ width: "10%" }}>Profits</span>
        <span style={{ width: "15%" }}>Note</span>
        <span
          style={{ width: "5%" }}
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
        <Items>{generateCartItem()}</Items>
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

  handleRemove(record_id, solid_id, type, addToCart) {
    dispatch(
      actionCreators.removeFromCartAction(record_id, solid_id, type, addToCart)
    );
  },

  handleSetReturnAllProfitsItem(_id, returnAllProfits) {
    console.log(_id, returnAllProfits);
    dispatch(
      actionCreators.setReturnAllProfitsItemAction(_id, returnAllProfits)
    );
  },
});

export default connect(mapState, mapDispatch)(Cart);
