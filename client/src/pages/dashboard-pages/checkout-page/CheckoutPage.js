import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Spin } from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { actionCreators } from "./store";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const Left = styled.div`
  width: 15%;
`;

const Right = styled.div`
  width: 85%;
  padding: 20px;
`;

const BlockWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Block = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #dfe0eb;
  border-radius: 15px;
  padding: 15px;
  background-color: white;
  cursor: pointer;
  :hover {
    border-color: #3751ff;
    div {
      color: #3751ff;
    }
    span {
      color: #3751ff;
    }
  }
`;

const BlockTitle = styled.div`
  font-size: 19px;
  font-weight: bold;
  color: #9fa2b4;
`;

const BlockContent = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: #252733;
  margin-top: 10px;
`;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 48, color: "#3751ff" }} spin />
);

const CheckoutPage = (props) => {
  const { itemsCount, countSpinning, getAllItems, allItems } = props;
  console.log(allItems);

  useEffect(() => {
    getAllItems();
  }, []);

  const { soldCount, stockCount, employeeCount, exceptionCount } = itemsCount;

  // set stock columns
  const columns = [
    {
      title: "All items",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
        },
        {
          title: "Cost / each (￥)",
          dataIndex: "cost",
          key: "cost",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
        },

        {
          title: "Note",
          dataIndex: "note",
          key: "note",
        },
      ],
    },
  ];

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header title="Checkout" userName="Tuantuan" userImage={userImage} />
        <BlockWrapper>
          <Block>
            <BlockTitle>Sold</BlockTitle>
            <BlockContent>
              {countSpinning ? (
                <Spin spinning={countSpinning} indicator={antIcon} />
              ) : (
                soldCount
              )}
            </BlockContent>
          </Block>
          <Block>
            <BlockTitle>Stock</BlockTitle>
            <BlockContent>
              {countSpinning ? (
                <Spin spinning={countSpinning} indicator={antIcon} />
              ) : (
                stockCount
              )}
            </BlockContent>
          </Block>
          <Block>
            <BlockTitle>Employee</BlockTitle>
            <BlockContent>
              {countSpinning ? (
                <Spin spinning={countSpinning} indicator={antIcon} />
              ) : (
                employeeCount
              )}
            </BlockContent>
          </Block>
          <Block>
            <BlockTitle>Exception</BlockTitle>
            <BlockContent>
              {countSpinning ? (
                <Spin spinning={countSpinning} indicator={antIcon} />
              ) : (
                exceptionCount
              )}
            </BlockContent>
          </Block>
        </BlockWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  itemsCount: state.getIn(["checkout", "itemsCount"]).toJS(),
  countSpinning: state.getIn(["checkout", "countSpinning"]),
  allItems: state.getIn(['checkout','allItems']).toJS()
});

const mapDispatch = (dispatch) => ({
  getAllItems() {
    dispatch(actionCreators.getAllItemsAction);
  },
});

export default connect(mapState, mapDispatch)(CheckoutPage);
