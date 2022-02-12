import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { actionTypes } from "./store";
import { fromJS } from "immutable";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const Right = styled.div`
  display: flex;
  align-items: baseline;
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Name = styled.span`
  font-weight: bold;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  border-radius: 20px;
`;

const Cart = styled.div`
  margin-left: 10px;
  font-weight: bold;
  cursor: pointer;
  text-decoration-line: underline;
  &.hide {
    display: none;
  }
`;

const Header = (props) => {
  const { setShowCart } = props;

  return (
    <Container>
      <Title>{props.title}</Title>
      <Right>
        <UserWrapper>
          <Name>{props.userName}</Name>
          <UserImage src={props.userImage}></UserImage>
        </UserWrapper>
        <Cart
          className={props.cartCount === "hide" ? "hide" : ""}
          onClick={() => setShowCart(true)}
        >
          Cart {props.cartCount}
        </Cart>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },
});

export default connect(mapState, mapDispatch)(Header);
