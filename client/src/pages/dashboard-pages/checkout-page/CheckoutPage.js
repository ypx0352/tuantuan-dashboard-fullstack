import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  InputNumber,
  Spin,
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
} from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import Cart from "../static/Cart";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";

const Container = styled.div`
  display: flex;
  min-width: 930px;
  min-height: 100vh;
  //background-color: #f7f8fc;
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

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PopconfirmInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const PopconfirmInputWrapper = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 48, color: "#3751ff" }} spin />
);

const colors = { cart: "#3751ff", stock: "sandybrown", employee: "#18a16d" };

const StyledButton = styled(Button).attrs((props) => ({
  style: { backgroundColor: colors[`${props.destination}`] },
  type: "primary",
}))`
  width: 90px;
  border-radius: 8px;
  border: none;
  color: white;
  margin-bottom: 5px;
  text-align: center;
  :hover {
    opacity: 0.7;
  }
  :active {
    opacity: 1;
  }
`;

const ExpandedRow = (props) => {
  const { pk_id, price, weight, exchangeRate, createdAt, log } = props.record;
  const localCreatedAt = new Date(createdAt).toLocaleString();
  return (
    <>
      <ul style={{ display: "inline-block", width: "33%" }}>
        <li>
          <strong>Package ID : </strong> {pk_id}
        </li>
        <li>
          <strong>Price / each : </strong> ${price}
        </li>
        <li>
          <strong>Weight / each : </strong> {weight} Kg
        </li>
      </ul>
      <ul style={{ display: "inline-block", width: "33%" }}>
        <li>
          <strong>Exchange rate : </strong> {exchangeRate}
        </li>
        <li>
          <strong>Created at : </strong> {localCreatedAt}
        </li>
      </ul>
      <ul style={{ display: "inline-block", width: "33%" }}>
        <li>
          <strong>Log : </strong>{" "}
        </li>
      </ul>
    </>
  );
};

const CheckoutPage = (props) => {
  const {
    itemsCount,
    countSpinning,
    getAllItems,
    allItems,
    blockSelected,
    setBlockSelected,
    handleAddToStock,
    handleAddToCart,
    showCart,
    cartItemsCount,
    showModal,
    setShowModal,
    prepareAddToException,
    addToException,
    handleAddToEmployee,
  } = props;

  useEffect(() => {
    getAllItems();
  }, []);

  const { soldCount, stockCount, employeeCount, exceptionCount, allCount } =
    itemsCount;

  const { soldItems, stockItems, employeeItems, exceptionItems } = allItems;

  // const hanldeInputChange = (record, index) => (e) => {
  //   const types = ["sold", "stock", "employee", "exception"];
  //   const tableData = [soldItems, stockItems, employeeItems, exceptionItems];
  //   const { qty, cost, type } = record;
  //   const typeIndex = types.indexOf(type);
  //   tableData[typeIndex][index].payment = e;
  //   tableData[typeIndex][index].profits = Number((e - qty * cost).toFixed(2));
  //   setTableDataState(tableData[typeIndex]);
  //   allItemsTableData = soldItems.concat(
  //     stockItems,
  //     employeeItems,
  //     exceptionItems
  //   );
  // };

  const [update, setUpdate] = useState();

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const generateButton = (record, destination) => {
    const methods = [handleAddToStock, handleAddToEmployee];
    const destinations = ["stock", "employee"];
    const index = destinations.indexOf(destination);
    if (destination != "cart") {
      return (
        <Popconfirm
          placement="topRight"
          title={
            <>
              <Button
                size="small"
                onClick={() => {
                  //record.addToStock = record.qty;
                  record[`addTo${capitalizeFirstLetter(destination)}`] =
                    record.qty;
                  setUpdate(record);
                }}
              >
                All
              </Button>
              Qty:
              <InputNumber
                size="small"
                min={1}
                max={record.qty}
                defaultValue={null}
                value={record[`addTo${capitalizeFirstLetter(destination)}`]}
                onChange={(e) => {
                  record[`addTo${capitalizeFirstLetter(destination)}`] = e;
                }}
              />
            </>
          }
          onConfirm={() => methods[index](record)}
          okText={`Add to ${destination}`}
          cancelText="Cancel"
        >
          <StyledButton destination={destination}>
            {capitalizeFirstLetter(destination)}
          </StyledButton>
        </Popconfirm>
      );
    } else {
      return (
        <Popconfirm
          placement="topRight"
          title={
            <PopconfirmInputContainer>
              <PopconfirmInputWrapper>
                <Button
                  size="small"
                  onClick={() => {
                    record.addToCart = record.qty;
                    setUpdate(record);
                  }}
                >
                  All
                </Button>
                Qty:
                <InputNumber
                  size="small"
                  min={1}
                  max={record.qty}
                  defaultValue={null}
                  value={record.addToCart}
                  onChange={(e) => {
                    record.addToCart = e;
                    setUpdate(record.addToCart);
                  }}
                />
              </PopconfirmInputWrapper>
              {record.type === "employee" ? (
                ""
              ) : (
                <>
                  <PopconfirmInputWrapper>
                    Subtotal (￥):
                    <InputNumber
                      size="small"
                      min={0}
                      controls={false}
                      defaultValue={null}
                      onChange={(e) => {
                        record.subtotal = e;
                        record.profits = Number(
                          (e - record.addToCart * record.cost).toFixed(2)
                        );
                        setUpdate(record.profits);
                      }}
                    />
                  </PopconfirmInputWrapper>
                  <PopconfirmInputWrapper>
                    Profits (￥):
                    <InputNumber
                      style={
                        record.profits >= 10
                          ? { color: "green" }
                          : { color: "red" }
                      }
                      bordered={false}
                      value={record.profits}
                      controls={false}
                    />
                  </PopconfirmInputWrapper>
                </>
              )}
            </PopconfirmInputContainer>
          }
          onConfirm={() => {
            if (record.profits >= 10) {
              handleAddToCart(record);
            } else {
              prepareAddToException(record);
            }
          }}
          okText="Add to cart"
          cancelText="Cancel"
        >
          <StyledButton destination="cart">Cart</StyledButton>
        </Popconfirm>
      );
    }
  };

  // Set columns
  const setColumns = (block) => [
    {
      title: block,
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
          title: "Noted",
          dataIndex: "note",
          key: "note",
        },
        {
          title: "Updated on",
          dataIndex: "date",
          key: "date",
        },
        {
          title: "Add to",
          dataIndex: "add",
          key: "add",
          render: (text, record, index) => {
            return (
              <ButtonWrapper>
                {generateButton(record, "cart")}
                {record.type === "stock" ? "" : generateButton(record, "stock")}
                {record.type === "employee"
                  ? ""
                  : generateButton(record, "employee")}
              </ButtonWrapper>
            );
          },
        },
      ],
    },
  ];

  const [columnsState, setColumnsState] = useState();

  useEffect(() => {
    setColumnsState(setColumns(blockSelected));
  }, [countSpinning]);

  // Default table data (all items)
  var allItemsTableData = soldItems.concat(
    stockItems,
    employeeItems,
    exceptionItems
  );

  const [tableDataState, setTableDataState] = useState([]);

  // Set table data
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

  useEffect(() => {
    setTableData(blockSelected);
  }, [countSpinning]);

  const handleBlockClicked = (block) => {
    setBlockSelected(block);
    setColumnsState(setColumns(block));
    setTableData(block);
  };

  const generateBlock = () => {
    const blockNames = ["All", "Sold", "Stock", "Employee", "Exception"];
    const counts = [
      allCount,
      soldCount,
      stockCount,
      employeeCount,
      exceptionCount,
    ];
    const blockIndex = blockNames.indexOf(blockSelected);

    return blockNames.map((name) => {
      return (
        <Block
          onClick={() => handleBlockClicked(name)}
          className={blockSelected === name ? "selected" : ""}
        >
          <BlockTitle>{name}</BlockTitle>
          <BlockContent>
            {countSpinning ? (
              <Spin spinning={countSpinning} indicator={antIcon} />
            ) : (
              counts[blockIndex]
            )}
          </BlockContent>
        </Block>
      );
    });
  };

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Cart className={showCart ? "" : "hide"} />
        <Header
          title="Checkout"
          userName="Tuantuan"
          userImage={userImage}
          cartCount={cartItemsCount}
        />
        <ContentWrapper>
          <BlockWrapper>{generateBlock()}</BlockWrapper>
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              tableLayout="auto"
              columns={columnsState}
              rowKey={(record) => record._id}
              dataSource={tableDataState}
              expandable={{
                expandedRowRender: (record) => <ExpandedRow record={record} />,
              }}
              bordered
            />
          </TableWrapper>
        </ContentWrapper>
      </Right>

      <Modal
        title="Profit exception!  "
        visible={showModal}
        okText="Add to exception"
        cancelText="Back"
        style={{ top: "20px" }}
        onOk={addToException}
        onCancel={() => setShowModal(false)}
      >
        <p>Profit is less than ￥10.00.</p>
        <p>Add the item to the exceptions or go back to modifications.</p>
      </Modal>
    </Container>
  );
};

const mapState = (state) => ({
  itemsCount: state.getIn(["checkout", "itemsCount"]).toJS(),
  countSpinning: state.getIn(["checkout", "countSpinning"]),
  allItems: state.getIn(["checkout", "allItems"]).toJS(),
  blockSelected: state.getIn(["checkout", "blockSelected"]),
  showCart: state.getIn(["static", "showCart"]),
  cartItemsCount: state.getIn(["static", "cartItemsCount"]),
  showModal: state.getIn(["checkout", "showModal"]),
});

const mapDispatch = (dispatch) => ({
  getAllItems() {
    dispatch(actionCreators.getAllItemsAction);
  },

  setBlockSelected(block) {
    dispatch({ type: actionTypes.BLOCK_SELECTED, value: fromJS(block) });
  },

  handleAddToStock(record) {
    const { addToStock } = record;
    if (addToStock === undefined) {
      message.warning("Invalid input!");
    } else {
      dispatch(actionCreators.addToStockAction(record));
    }
  },

  handleAddToEmployee(record) {
    const { addToEmployee } = record;
    if (addToEmployee === undefined) {
      message.warning("Invalid input!");
    } else {
      dispatch(actionCreators.addToEmployeeAction(record));
    }
  },

  handleAddToCart(record) {
    const { addToCart } = record;
    if (addToCart === undefined) {
      message.warning("Invalid input!");
    } else {
      dispatch(actionCreators.addToCartAction(record));
    }
  },

  setShowModal(value) {
    dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(value) });
  },

  prepareAddToException(record) {
    dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(true) });
    console.log(record);
  },

  addToException() {
    console.log("add to exception");
  },
});

export default connect(mapState, mapDispatch)(CheckoutPage);
