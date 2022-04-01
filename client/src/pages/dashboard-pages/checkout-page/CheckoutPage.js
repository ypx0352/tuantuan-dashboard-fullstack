import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  InputNumber,
  Spin,
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Input,
} from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import Cart from "../static/Cart";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";
import TextArea from "antd/lib/input/TextArea";

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

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0 25px 0;
`;

const StyledInput = styled(Input).attrs({
  placeholder: "Please enter the receiver, package ID or item name",
})`
  width: 50%;
  height: 50px;
  ::placeholder {
    color: grey;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px 0;
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

const colors = {
  cart: " #145DA0",
  sold: "darkgreen",
  stock: "sandybrown",
  employee: "#18a16d",
  recover: "#E8B4B8",
  exception: "#DF362D",
  approve: "#3751ff",
};

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
  :disabled {
    color: grey;
  }
`;

const StyledSpan = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 10px;
  color: white;
`;

const ExpandedRow = (props) => {
  const { price, weight, exchangeRate, createdAt, log, updatedAt } =
    props.record;
  const localCreatedAt = new Date(createdAt).toLocaleString();
  const localUpdatedAt = new Date(updatedAt).toLocaleString();
  return (
    <>
      <ul style={{ display: "inline-block", width: "33%" }}>
        <li>
          <strong>Price / each : </strong> ${price}
        </li>
        <li>
          <strong>Weight / each : </strong> {weight} Kg
        </li>
        <li>
          <strong>Exchange rate : </strong> {exchangeRate}
        </li>
      </ul>
      <ul style={{ display: "inline-block", width: "33%" }}>
        <li>
          <strong>Created at : </strong> {localCreatedAt}
        </li>
        <li>
          <strong>Updated at : </strong> {localUpdatedAt}
        </li>
      </ul>
      <ul style={{ display: "inline-block", width: "33%" }}>
        <li>
          <strong>Log : </strong>
          {log}
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
    addToException,
    handleAddToEmployee,
    handleRecoverFromException,
    handleExceptionItemApprove,
    updateNote,
  } = props;

  useEffect(() => {
    getAllItems();
  }, []);

  const { soldCount, stockCount, employeeCount, exceptionCount, allCount } =
    itemsCount;

  const { soldItems, stockItems, employeeItems, exceptionItems } = allItems;

  const [update, setUpdate] = useState();

  const [exceptionItem, setExceptionItem] = useState({});

  const [modalOkButtonDisabled, setModalOkButtonDisabled] = useState(false);

  const [columnsState, setColumnsState] = useState();

  const [tableDataState, setTableDataState] = useState([]);

  useEffect(() => {
    setColumnsState(setColumns(blockSelected));
  }, [blockSelected]);

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const generateButton = (record, destination) => {
    const methods = [
      handleAddToStock,
      handleAddToEmployee,
      handleRecoverFromException,
      handleExceptionItemApprove,
    ];
    const destinations = ["stock", "employee", "recover", "approve"];
    const index = destinations.indexOf(destination);

    if (destination !== "cart") {
      return destination === "approve" ? (
        <Popconfirm
          disabled={record.qty_available <= 0 ? true : ""}
          placement="topRight"
          title="Do you want to approve it?"
          onConfirm={() => methods[index](record)}
          okText={
            destination === "recover"
              ? "Recover"
              : destination === "approve"
              ? "Approve"
              : `Add to ${destination}`
          }
          cancelText="Cancel"
        >
          <StyledButton
            destination={destination}
            disabled={record.qty_available <= 0 ? true : ""}
          >
            {capitalizeFirstLetter(destination)}
          </StyledButton>
        </Popconfirm>
      ) : (
        <Popconfirm
          disabled={record.qty_available <= 0 ? true : ""}
          placement="topRight"
          title={
            <>
              <Button
                size="small"
                onClick={() => {
                  //record.addToStock = record.qty;
                  record[`addTo${capitalizeFirstLetter(destination)}`] =
                    record.qty_available;
                  setUpdate(record);
                }}
              >
                All
              </Button>
              Qty:
              <InputNumber
                size="small"
                min={1}
                max={record.qty_available}
                defaultValue={null}
                value={record[`addTo${capitalizeFirstLetter(destination)}`]}
                onChange={(e) => {
                  record[`addTo${capitalizeFirstLetter(destination)}`] = e;
                }}
              />
            </>
          }
          onConfirm={() => methods[index](record)}
          okText={
            destination === "recover"
              ? "Recover"
              : destination === "approve"
              ? "Approve"
              : `Add to ${destination}`
          }
          cancelText="Cancel"
        >
          <StyledButton
            destination={destination}
            disabled={record.qty_available <= 0 ? true : ""}
          >
            {capitalizeFirstLetter(destination)}
          </StyledButton>
        </Popconfirm>
      );
    } else {
      return (
        <Popconfirm
          placement="topRight"
          disabled={record.qty_available <= 0 ? true : ""}
          title={
            <PopconfirmInputContainer>
              <PopconfirmInputWrapper>
                <Button
                  size="small"
                  onClick={() => {
                    record.addToCart = record.qty_available;
                    setUpdate(record);
                  }}
                >
                  All
                </Button>
                Qty:
                <InputNumber
                  size="small"
                  min={1}
                  max={record.qty_available}
                  defaultValue={null}
                  value={record.addToCart}
                  onChange={(e) => {
                    record.addToCart = e;
                    setUpdate(record.addToCart);
                  }}
                />
              </PopconfirmInputWrapper>
              {record.type === "employee" || record.type === "exception" ? (
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
                        record.profits >= 0
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
            if (
              record.profits >= 0 ||
              record.type === "employee" ||
              record.type === "exception"
            ) {
              handleAddToCart(record);
            } else {
              setExceptionItem(record);
              setShowModal(true);
              setModalOkButtonDisabled(false);
            }
          }}
          okText="Add to cart"
          cancelText="Cancel"
        >
          <StyledButton
            destination="cart"
            disabled={record.qty_available <= 0 ? true : ""}
          >
            Cart
          </StyledButton>
        </Popconfirm>
      );
    }
  };

  // Set columns
  const setColumns = (block) =>
    block !== "Exception"
      ? [
          {
            title: `${block} items`,
            children: [
              {
                title: "Item",
                dataIndex: "item",
                key: "item",
              },
              {
                title: "Qty",
                dataIndex: "qty_available",
                key: "qty_available",
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
                render: (text, record, index) => {
                  return <StyledSpan type={text}>{text}</StyledSpan>;
                },
              },
              {
                title: "Parcel",
                dataIndex: "parcel",
                key: "parcel",
                render: (text, record, index) => {
                  return (
                    <>
                      <div>
                        <Link
                          to={`/dashboard/address/?receiver=${record.receiver}`}
                          target="_blank"
                        >
                          {record.receiver}
                        </Link>
                      </div>
                      <div>
                        <Link
                          to={`/dashboard/package/?pk_id=${record.pk_id}`}
                          target="_blank"
                        >
                          {record.pk_id}
                        </Link>
                      </div>
                      <div>{record.sendTimeLocale}</div>
                    </>
                  );
                },
              },
              {
                title: "Note",
                dataIndex: "note",
                key: "note",
                render: (text, record, index) => {
                  return (
                    <TextArea
                      defaultValue={text}
                      autoSize
                      bordered={false}
                      onChange={(e) => {
                        record.newNote = e.target.value.trim();
                      }}
                      onBlur={() => updateNote(record)}
                    />
                  );
                },
              },
              {
                title: "Add to",
                dataIndex: "add",
                key: "add",
                render: (text, record, index) => {
                  return (
                    <ButtonWrapper>
                      {record.type === "sold" && (
                        <>
                          {generateButton(record, "cart")}
                          {generateButton(record, "employee")}
                          {generateButton(record, "stock")}
                        </>
                      )}
                      {record.type === "stock" && (
                        <>
                          {generateButton(record, "cart")}
                          {generateButton(record, "employee")}
                        </>
                      )}
                      {record.type === "employee" && (
                        <>
                          {generateButton(record, "cart")}
                          {generateButton(record, "stock")}
                        </>
                      )}
                      {record.type === "exception" && (
                        <>
                          {record.approved && generateButton(record, "cart")}
                          {generateButton(record, "recover")}
                          {!record.approved &&
                            generateButton(record, "approve")}
                        </>
                      )}
                    </ButtonWrapper>
                  );
                },
              },
            ],
          },
        ]
      : [
          {
            title: `${block} items`,
            children: [
              {
                title: "Item",
                dataIndex: "item",
                key: "item",
              },
              {
                title: "Qty",
                dataIndex: "qty_available",
                key: "qty_available",
              },
              {
                title: "Cost / each (￥)",
                dataIndex: "cost",
                key: "cost",
              },
              {
                title: "Payment / row (￥)",
                dataIndex: "subtotal",
                key: "subtotal",
              },
              {
                title: "Payback / row (￥)",
                dataIndex: "payAmount",
                key: "payAmount",
              },
              {
                title: "Original type",
                dataIndex: "originalType",
                key: "originalType",
              },
              {
                title: "Approved",
                dataIndex: "approved",
                key: "approved",
                render: (text, record, index) => {
                  return text ? (
                    <span
                      style={{ color: "green" }}
                      className="material-icons-outlined"
                    >
                      check
                    </span>
                  ) : (
                    <span
                      style={{ color: "red" }}
                      className="material-icons-outlined"
                    >
                      clear
                    </span>
                  );
                },
              },
              {
                title: "Parcel",
                dataIndex: "parcel",
                key: "parcel",
                render: (text, record, index) => {
                  return (
                    <>
                      <div>
                        <Link
                          to={`/dashboard/address/?receiver=${record.receiver}`}
                          target="_blank"
                        >
                          {record.receiver}
                        </Link>
                      </div>
                      <div>
                        <Link
                          to={`/dashboard/package/?pk_id=${record.pk_id}`}
                          target="_blank"
                        >
                          {record.pk_id}
                        </Link>
                      </div>
                      <div>{record.sendTimeLocale}</div>
                    </>
                  );
                },
              },
              {
                title: "Note",
                dataIndex: "note",
                key: "note",
                render: (text, record, index) => {
                  return (
                    <TextArea
                      defaultValue={text}
                      autoSize
                      bordered={false}
                      onChange={(e) => {
                        record.newNote = e.target.value.trim();
                      }}
                      onBlur={() => updateNote(record)}
                    />
                  );
                },
              },
              {
                title: "Add to",
                dataIndex: "add",
                key: "add",
                render: (text, record, index) => {
                  return (
                    <ButtonWrapper>
                      {record.approved && generateButton(record, "cart")}
                      {generateButton(record, "recover")}
                      {!record.approved && generateButton(record, "approve")}
                    </ButtonWrapper>
                  );
                },
              },
            ],
          },
        ];

  // Default table data (all items)
  var allItemsTableData = soldItems.concat(
    stockItems,
    employeeItems,
    exceptionItems
  );

  // Set table data
  const setTableData = (block) => {
    const blockNames = ["All", "Sold", "Stock", "Employee", "Exception"];
    const tableData = [
      allItemsTableData,
      soldItems,
      stockItems,
      employeeItems,
      exceptionItems,
    ];
    const dataIndex = blockNames.indexOf(block);
    return setTableDataState(tableData[dataIndex]);
  };

  const getTableData = (block) => {
    const blockNames = ["All", "Sold", "Stock", "Employee", "Exception"];
    const tableData = [
      allItemsTableData,
      soldItems,
      stockItems,
      employeeItems,
      exceptionItems,
    ];
    const dataIndex = blockNames.indexOf(block);
    return tableData[dataIndex];
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
    return blockNames.map((name) => {
      const blockIndex = blockNames.indexOf(name);
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

  const handleSearch = (searchInput) => {
    if (searchInput.trim() === "") {
      setTableData(blockSelected);
    } else {
      const searchPatten = new RegExp(`\W*${searchInput.trim()}\W*`);
      setTableDataState(
        getTableData(blockSelected).filter((item) => {
          return (
            searchPatten.test(item.item) ||
            searchPatten.test(item.receiver) ||
            searchPatten.test(item.pk_id) ||
            searchPatten.test(item.sendTimeLocale)
          );
        })
      );
    }
  };

  return (
    <Container>
      <Left>
        <Sidebar selected="checkout" />
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
          <SearchWrapper>
            <StyledInput
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </SearchWrapper>
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
        onOk={() => {
          addToException(exceptionItem);
          setModalOkButtonDisabled(true);
        }}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ disabled: modalOkButtonDisabled }}
      >
        <h3 style={{ color: "darkred" }}>Profit is less than ￥0.00.</h3>
        <p>
          Add the item to the exceptions or go back to modifications. The item
          in the exception collection needs to be comfirmed by the administrator
          before being added to the cart.
        </p>
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

  addToException(item) {
    dispatch(actionCreators.addToExceptionAction(item));
  },

  handleRecoverFromException(record) {
    dispatch(actionCreators.recoverFromExceptionAction(record));
  },

  handleExceptionItemApprove(record) {
    dispatch(actionCreators.approveExceptionItemAction(record._id));
  },

  updateNote(record) {
    const { newNote, note } = record;
    if (newNote !== undefined && note !== newNote) {
      dispatch(actionCreators.updateNoteAction(record));
    }
  },
});

export default connect(mapState, mapDispatch)(CheckoutPage);
