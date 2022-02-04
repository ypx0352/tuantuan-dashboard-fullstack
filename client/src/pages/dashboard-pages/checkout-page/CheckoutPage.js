import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  InputNumber,
  Input,
  Spin,
  Table,
  Button,
  Popconfirm,
  message,
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
  } = props;

  useEffect(() => {
    getAllItems();
  }, []);

  const { soldCount, stockCount, employeeCount, exceptionCount, allCount } =
    itemsCount;

  const { soldItems, stockItems, employeeItems, exceptionItems } = allItems;

  const hanldeInputChange = (record, index) => (e) => {
    const types = ["sold", "stock", "employee", "exception"];
    const tableData = [soldItems, stockItems, employeeItems, exceptionItems];
    const { qty, cost, type } = record;
    const typeIndex = types.indexOf(type);
    tableData[typeIndex][index].payment = e;
    tableData[typeIndex][index].profits = Number((e - qty * cost).toFixed(2));
    setTableDataState(tableData[typeIndex]);
    allItemsTableData = soldItems.concat(
      stockItems,
      employeeItems,
      exceptionItems
    );
  };

  const [update, setUpdate] = useState();

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
          title: "Note",
          dataIndex: "note",
          key: "note",
        },
        {
          title: "Date",
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
                <Popconfirm
                  placement="topRight"
                  title={
                    <PopconfirmInputContainer>
                      <PopconfirmInputWrapper>
                        Qty:
                        <InputNumber
                          size="small"
                          min={1}
                          max={record.qty}
                          defaultValue={null}
                          onChange={(e) => {
                            record.addToCart = e;
                          }}
                        />
                      </PopconfirmInputWrapper>
                      {record.type === "employee" ? (
                        ""
                      ) : (
                        <>
                          <PopconfirmInputWrapper>
                            Subtotal (￥): {"  "}
                            <InputNumber
                              size="small"
                              min={0}
                              controls={false}
                              defaultValue={null}
                              onChange={(e) => {
                                record.subtotal = e;
                                record.profits = Number(
                                  (e - record.addToCart * record.cost).toFixed(
                                    2
                                  )
                                );
                                setUpdate(record.profits);
                              }}
                            />
                          </PopconfirmInputWrapper>
                          <PopconfirmInputWrapper>
                            Profits (￥):
                            <InputNumber
                              min={10}
                              bordered={false}
                              value={record.profits}
                              controls={false}
                            />
                          </PopconfirmInputWrapper>
                        </>
                      )}
                    </PopconfirmInputContainer>
                  }
                  onConfirm={() => handleAddToCart(record)}
                  okText="Add to cart"
                  cancelText="Cancel"
                >
                  <Button
                    style={{
                      width: "70px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "none",
                      textAlign: "center",
                      backgroundColor: "#3751ff",
                      color: "white",
                    }}
                  >
                    Cart
                  </Button>
                </Popconfirm>

                {record.type === "stock" ? (
                  ""
                ) : (
                  <Popconfirm
                    placement="topRight"
                    title={
                      <>
                        Qty: {"  "}
                        <InputNumber
                          size="small"
                          min={1}
                          max={record.qty}
                          defaultValue={null}
                          onChange={(e) => {
                            record.addToStock = e;
                          }}
                        />
                      </>
                    }
                    onConfirm={() => handleAddToStock(record)}
                    okText="Add to stock"
                    cancelText="Cancel"
                  >
                    <Button
                      style={{
                        width: "70px",
                        borderRadius: "8px",
                        border: "none",
                        textAlign: "center",
                        backgroundColor: "sandybrown",
                        color: "white",
                      }}
                    >
                      Stock
                    </Button>
                  </Popconfirm>
                )}
              </ButtonWrapper>
            );
          },
        },
      ],
    },
  ];

  // const setColumns = (block) => {
  //   if (block === "Employee Items") {
  //     return [
  //       {
  //         title: block,
  //         children: [
  //           {
  //             title: "Item",
  //             dataIndex: "item",
  //             key: "item",
  //           },
  //           {
  //             title: "Qty",
  //             dataIndex: "qty",
  //             key: "qty",
  //           },
  //           {
  //             title: "Cost / each (￥)",
  //             dataIndex: "cost",
  //             key: "cost",
  //           },
  //           {
  //             title: "Type",
  //             dataIndex: "type",
  //             key: "type",
  //           },
  //           {
  //             title: "Note",
  //             dataIndex: "note",
  //             key: "note",
  //           },
  //           {
  //             title: "Date",
  //             dataIndex: "date",
  //             key: "date",
  //           },
  //           {
  //             title: "Add to",
  //             dataIndex: "add",
  //             key: "add",
  //             render: (text, record, index) => {
  //               return (
  //                 <ButtonWrapper>
  //                   <Popconfirm
  //                     placement="topRight"
  //                     title={
  //                       <PopconfirmInputContainer>
  //                         <PopconfirmInputWrapper>
  //                           Count:
  //                           <InputNumber
  //                             size="small"
  //                             min={1}
  //                             max={record.qty}
  //                             defaultValue={null}
  //                             onChange={(e) => {
  //                               record.addToCart = e;
  //                             }}
  //                           />
  //                         </PopconfirmInputWrapper>
  //                       </PopconfirmInputContainer>
  //                     }
  //                     onConfirm={() => handleAddToCart(record)}
  //                     okText="Add to cart"
  //                     cancelText="Cancel"
  //                   >
  //                     <Button
  //                       style={{
  //                         width: "70px",
  //                         marginBottom: "10px",
  //                         borderRadius: "8px",
  //                         border: "none",
  //                         textAlign: "center",
  //                         backgroundColor: "#3751ff",
  //                         color: "white",
  //                       }}
  //                     >
  //                       Cart
  //                     </Button>
  //                   </Popconfirm>
  //                   {record.type === "stock" ? (
  //                     ""
  //                   ) : (
  //                     <Popconfirm
  //                       placement="topRight"
  //                       title={
  //                         <>
  //                           Number of items to be added to the stock: {"  "}
  //                           <InputNumber
  //                             size="small"
  //                             min={1}
  //                             max={record.qty}
  //                             defaultValue={null}
  //                             onChange={(e) => (record.addToStock = e)}
  //                           />
  //                         </>
  //                       }
  //                       onConfirm={() => handleAddToStock(record)}
  //                       okText="Add to stock"
  //                       cancelText="Cancel"
  //                     >
  //                       <Button
  //                         style={{
  //                           width: "70px",
  //                           borderRadius: "8px",
  //                           border: "none",
  //                           textAlign: "center",
  //                           backgroundColor: "sandybrown",
  //                           color: "white",
  //                         }}
  //                       >
  //                         Stock
  //                       </Button>
  //                     </Popconfirm>
  //                   )}
  //                 </ButtonWrapper>
  //               );
  //             },
  //           },
  //         ],
  //       },
  //     ];
  //   } else {
  //     return [
  //       {
  //         title: block,
  //         children: [
  //           {
  //             title: "Item",
  //             dataIndex: "item",
  //             key: "item",
  //           },
  //           {
  //             title: "Qty",
  //             dataIndex: "qty",
  //             key: "qty",
  //           },
  //           {
  //             title: "Cost / each (￥)",
  //             dataIndex: "cost",
  //             key: "cost",
  //           },
  //           {
  //             title: "Type",
  //             dataIndex: "type",
  //             key: "type",
  //           },
  //           {
  //             title: "Note",
  //             dataIndex: "note",
  //             key: "note",
  //           },
  //           {
  //             title: "Date",
  //             dataIndex: "date",
  //             key: "date",
  //           },
  //           // {
  //           //   title: "Payment / row (￥)",
  //           //   dataIndex: "payment",
  //           //   key: "payment",
  //           //   render: (text, record, index) => {
  //           //     return (
  //           //       <InputNumber
  //           //         disabled={record.type === "employee" ? true : false}
  //           //         type="number"
  //           //         bordered={false}
  //           //         prefix="￥"
  //           //         value={text}
  //           //         controls={false}
  //           //         min={0}
  //           //         onChange={hanldeInputChange(record, index)}
  //           //       />
  //           //     );
  //           //   },
  //           // },
  //           // {
  //           //   title: "Profits / row (￥)",
  //           //   dataIndex: "profits",
  //           //   key: "profits",
  //           //   render: (text, record, index) => {
  //           //     return (
  //           //       <InputNumber
  //           //         disabled={record.type === "employee" ? true : false}
  //           //         min={10}
  //           //         bordered={false}
  //           //         value={text}
  //           //         controls={false}
  //           //       />
  //           //     );
  //           //   },
  //           // },
  //           {
  //             title: "Add to",
  //             dataIndex: "add",
  //             key: "add",
  //             render: (text, record, index) => {
  //               return (
  //                 <ButtonWrapper>
  //                   <Popconfirm
  //                     placement="topRight"
  //                     title={
  //                       <PopconfirmInputContainer>
  //                         <PopconfirmInputWrapper>
  //                           Count:
  //                           <InputNumber
  //                             size="small"
  //                             min={1}
  //                             max={record.qty}
  //                             defaultValue={null}
  //                             onChange={(e) => {
  //                               record.addToCart = e;
  //                             }}
  //                           />
  //                         </PopconfirmInputWrapper>
  //                         {record.type === "employee" ? (
  //                           ""
  //                         ) : (
  //                           <>
  //                             <PopconfirmInputWrapper>
  //                               Subtotal (￥): {"  "}
  //                               <InputNumber
  //                                 size="small"
  //                                 min={0}
  //                                 controls={false}
  //                                 defaultValue={null}
  //                                 onChange={(e) => {
  //                                   record.profits =
  //                                     e - record.addToCart * record.cost;
  //                                 }}
  //                               />
  //                             </PopconfirmInputWrapper>
  //                             <PopconfirmInputWrapper>
  //                               Profits (￥):
  //                               <InputNumber
  //                                 min={10}
  //                                 bordered={false}
  //                                 value={record.profits}
  //                                 controls={false}
  //                               />
  //                             </PopconfirmInputWrapper>
  //                           </>
  //                         )}
  //                       </PopconfirmInputContainer>
  //                     }
  //                     onConfirm={() => handleAddToCart(record)}
  //                     okText="Add to cart"
  //                     cancelText="Cancel"
  //                   >
  //                     <Button
  //                       style={{
  //                         width: "70px",
  //                         marginBottom: "10px",
  //                         borderRadius: "8px",
  //                         border: "none",
  //                         textAlign: "center",
  //                         backgroundColor: "#3751ff",
  //                         color: "white",
  //                       }}
  //                     >
  //                       Cart
  //                     </Button>
  //                   </Popconfirm>

  //                   {record.type === "stock" ? (
  //                     ""
  //                   ) : (
  //                     <Popconfirm
  //                       placement="topRight"
  //                       title={
  //                         <>
  //                           Number of items to be added to the stock: {"  "}
  //                           <InputNumber
  //                             size="small"
  //                             min={1}
  //                             max={record.qty}
  //                             defaultValue={null}
  //                             onChange={(e) => {
  //                               record.addToStock = e;
  //                             }}
  //                           />
  //                         </>
  //                       }
  //                       onConfirm={() => handleAddToStock(record)}
  //                       okText="Add to stock"
  //                       cancelText="Cancel"
  //                     >
  //                       <Button
  //                         style={{
  //                           width: "70px",
  //                           borderRadius: "8px",
  //                           border: "none",
  //                           textAlign: "center",
  //                           backgroundColor: "sandybrown",
  //                           color: "white",
  //                         }}
  //                       >
  //                         Stock
  //                       </Button>
  //                     </Popconfirm>
  //                   )}
  //                 </ButtonWrapper>
  //               );
  //             },
  //           },
  //         ],
  //       },
  //     ];
  //   }
  // };

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
          cartCount={20}
        />
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
              tableLayout="auto"
              columns={columnsState}
              rowKey={(record) => record._id}
              dataSource={tableDataState}
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
  showCart: state.getIn(["static", "showCart"]),
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

  handleAddToCart(record) {
    const { addToCart } = record;
    if (addToCart === undefined) {
      message.warning("Invalid input!");
    }
    console.log(record);
  },
});

export default connect(mapState, mapDispatch)(CheckoutPage);