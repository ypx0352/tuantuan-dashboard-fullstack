import { fromJS } from "immutable";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { actionTypes } from "./store";

const SidebarWrapper = styled.div`
  height: 100%;
  // min-width: 150px;
  width: 150px;
  display: flex;
  flex-direction: column;
  background-color: #363740;
  transition: width 1s ease-in-out;
  overflow: auto;
  &.hide {
    width: 0px;
  }
`;

const DashboardTitle = styled.div`
  font-size: 19px;
  color: #a4a6b3;
  text-align: center;
  margin-top: 10px;
`;

const List = styled.div`
  margin-top: 20px;
  border-bottom: 1px #3c3e4c solid;
  font-size: 16px;
`;

const ListItemWrapper = styled.a`
  height: 56px;
  display: flex;
  align-items: center;
  color: #a4a6b3;
  padding-left: 20px;
  cursor: pointer;
  text-decoration: none;
  :hover {
    color: white;
    background-color: #3c3e4c;
    border-bottom: 2px solid white;
  }
  &.selected {
    color: white;
    background-color: #3c3e4c;
    border-left: 10px solid white;
  }
`;

const ListItemText = styled.span`
  margin-left: 15px;
`;

const ListItemIcon = styled.span``;

const Sidebar = (props) => {
  const { selected, showSidebar, setShowSidebar } = props;
  return (
    <SidebarWrapper className={showSidebar ? "" : "hide"}>
      <DashboardTitle>Tuantuan Dashbord</DashboardTitle>
      <List>
        <ListItemWrapper
          href="/dashboard/overview"
          className={selected === "overview" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            timeline
          </ListItemIcon>
          <ListItemText>Overview</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/order"
          className={selected === "order" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            shopping_bag
          </ListItemIcon>
          <ListItemText>Order</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/checkout"
          className={selected === "checkout" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            shopping_cart_checkout
          </ListItemIcon>
          <ListItemText>Checkout</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/package"
          className={selected === "package" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            flight_takeoff
          </ListItemIcon>
          <ListItemText>Package</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/address"
          className={selected === "address" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            import_contacts
          </ListItemIcon>
          <ListItemText>Address</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper href="/dashboard/product">
          <ListItemIcon className="material-icons-outlined">
            loyalty
          </ListItemIcon>
          <ListItemText>Product</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/setting"
          className={selected === "setting" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            settings
          </ListItemIcon>
          <ListItemText>Setting</ListItemText>
        </ListItemWrapper>
      </List>
    </SidebarWrapper>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
});

const mapDispatch = (dispatch) => ({
  setShowSidebar(value) {
    dispatch({ type: actionTypes.SET_SHOW_SIDEBAR, value: fromJS(value) });
  },
});

export default connect(mapState, mapDispatch)(Sidebar);
