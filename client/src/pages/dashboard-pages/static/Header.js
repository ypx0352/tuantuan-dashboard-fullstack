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

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.span.attrs({ className: "material-icons-outlined" })`
  font-size: 30px;
  cursor: pointer;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin-left: 5px;
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
  const { setShowCart, showSidebar, handleShowSidebar } = props;

  return (
    <Container>
      <Left>
        <Icon onClick={() => handleShowSidebar(!showSidebar)}>
          {showSidebar ? "menu_open" : "menu"}
        </Icon>
        <Title>{props.title}</Title>
      </Left>

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

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },

  handleShowSidebar(value) {
    dispatch({ type: actionTypes.SET_SHOW_SIDEBAR, value: fromJS(value) });
  },
});

export default connect(mapState, mapDispatch)(Header);
