import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { InputNumber, Spin, Table } from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  margin: 0 5px;
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
  &.selected {
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

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0;
  justify-content: center;
  align-items: center;
`;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 48, color: "#3751ff" }} spin />
);

const CheckoutPage = (props) => {
  const {
    itemsCount,
    countSpinning,
    getAllItems,
    allItems,
    blockSelected,
    setBlockSelected,
  } = props;

  useEffect(() => {
    getAllItems();
  }, []);

  const { soldCount, stockCount, employeeCount, exceptionCount, allCount } =
    itemsCount;

  const { soldItems, stockItems, employeeItems, exceptionItems } = allItems;

  // Default columns (all items)
  const allItemsColumns = [
    {
      title: "All Items",
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
          title: "Payment",
          dataIndex: "payment",
          key: "payment",
          render: (text, record, index) => {
            return (
              <InputNumber
                bordered={false}
                prefix="￥"
                value={text}
                controls={false}
                min={0}
                //onChange={}
              />
            );
          },
        },

        {
          title: "Note",
          dataIndex: "note",
          key: "note",
        },
      ],
    },
  ];

  const [columnsState, setColumnsState] = useState(allItemsColumns);

  // Set columns
  const setColumns = (block) =>
    setColumnsState([
      {
        title: `${block}`,
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
            title: "Payment",
            dataIndex: "payment",
            key: "payment",
            render: (text, record, index) => {
              return (
                <InputNumber
                  bordered={false}
                  prefix="￥"
                  value={text}
                  controls={false}
                  min={0}
                  //onChange={}
                />
              );
            },
          },

          {
            title: "Note",
            dataIndex: "note",
            key: "note",
          },
        ],
      },
    ]);

  // Default table data (all items)
  const allItemsTableData = soldItems.concat(
    stockItems,
    employeeItems,
    exceptionItems
  );

  const [tableDataState, setTableDataState] = useState([]);

  //Set table data
  const setTableData = (block) => {
    switch (block) {
      case "All Items":
        return setTableDataState(allItemsTableData);
      case "Sold Items":
        return setTableDataState(soldItems);
      case "Stock Items":
        return setTableDataState(stockItems);
      case "Employee Items":
        return setTableDataState(employeeItems);
      case "Exception Items":
        return setTableDataState(exceptionItems);
    }
  };

  const handleBlockClicked = (block) => {
    setBlockSelected(block);
    setColumns(block);
    setTableData(block);
  };

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header title="Checkout" userName="Tuantuan" userImage={userImage} />
        <ContentWrapper>
          <BlockWrapper>
            <Block
              onClick={() => handleBlockClicked("All Items")}
              className={blockSelected === "All Items" ? "selected" : ""}
            >
              <BlockTitle>All</BlockTitle>
              <BlockContent>
                {countSpinning ? (
                  <Spin spinning={countSpinning} indicator={antIcon} />
                ) : (
                  allCount
                )}
              </BlockContent>
            </Block>
            <Block
              onClick={() => handleBlockClicked("Sold Items")}
              className={blockSelected === "Sold Items" ? "selected" : ""}
            >
              <BlockTitle>Sold</BlockTitle>
              <BlockContent>
                {countSpinning ? (
                  <Spin spinning={countSpinning} indicator={antIcon} />
                ) : (
                  soldCount
                )}
              </BlockContent>
            </Block>
            <Block
              onClick={() => handleBlockClicked("Stock Items")}
              className={blockSelected === "Stock Items" ? "selected" : ""}
            >
              <BlockTitle>Stock</BlockTitle>
              <BlockContent>
                {countSpinning ? (
                  <Spin spinning={countSpinning} indicator={antIcon} />
                ) : (
                  stockCount
                )}
              </BlockContent>
            </Block>
            <Block
              onClick={() => handleBlockClicked("Employee Items")}
              className={blockSelected === "Employee Items" ? "selected" : ""}
            >
              <BlockTitle>Employee</BlockTitle>
              <BlockContent>
                {countSpinning ? (
                  <Spin spinning={countSpinning} indicator={antIcon} />
                ) : (
                  employeeCount
                )}
              </BlockContent>
            </Block>
            <Block
              onClick={() => handleBlockClicked("Exception Items")}
              className={blockSelected === "Exception Items" ? "selected" : ""}
            >
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
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              columns={columnsState}
              dataSource={
                tableDataState.length === 0 && blockSelected === "All Items"
                  ? allItemsTableData
                  : tableDataState
              }
              bordered
            />
          </TableWrapper>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  itemsCount: state.getIn(["checkout", "itemsCount"]).toJS(),
  countSpinning: state.getIn(["checkout", "countSpinning"]),
  allItems: state.getIn(["checkout", "allItems"]).toJS(),
  blockSelected: state.getIn(["checkout", "blockSelected"]),
});

const mapDispatch = (dispatch) => ({
  getAllItems() {
    dispatch(actionCreators.getAllItemsAction);
  },

  setBlockSelected(block) {
    dispatch({ type: actionTypes.BLOCK_SELECTED, value: fromJS(block) });
  },
});

export default connect(mapState, mapDispatch)(CheckoutPage);
