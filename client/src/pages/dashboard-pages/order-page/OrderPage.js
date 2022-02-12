import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  Table,
  Input,
  Spin,
  message,
  BackTop,
  Button,
  Modal,
  InputNumber,
} from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";

const { TextArea } = Input;

const Container = styled.div`
  position: relative;
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

const OrderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding-bottom: 5px;
  border-bottom: 1px dashed grey;
`;

const Btn = styled.div`
  width: 10%;
  padding: 12px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  text-align: center;
  background-color: #3751ff;
  cursor: pointer;
  color: white;
`;

const ExchangeRateWrapper = styled.a.attrs({ target: "_blank" })`
  text-align: right;
  color: #3751ff;
  padding: 0 10px;
  font-weight: bold;
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  &.hide {
    display: none;
  }
`;

const ConfirmationContainer = styled.div``;

const ConfirmationWrapper = styled.div`
  &.hide {
    display: none;
  }
`;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#3751ff" }} spin />
);

const OrderPage = (props) => {
  const {
    originalOrder,
    handleSearch,
    spinning,
    exchangeRate,
    initializeExchangeRate,
    exchangeRateSpinning,
    handleSubmit,
    showConfirmation,
    setShowConfirmation,
    confirmationSpinning,
    confirmationData,
    handleConfirm,
    submitLoading,
    showConfirmationResultDialog,
    handleOnOk,
    setShowConfirmationResultDialog,
    confirmResult,
    confirmLoading,
    normalPostage,
    babyFormulaPostage,
    exchangeRateInSetting,
    initializeSettings,
  } = props;

  // Some parameter that should be stored in setting file
  // const normalPostage = 7.4;
  // const babyFormulaPostage = 18.9;
  // const exchangeRateInSetting = 4.7;

  const searchInputEl = useRef(null);

  // get settings
  useEffect(() => initializeSettings(), []);

  // get current exchange rate
  useEffect(() => initializeExchangeRate(exchangeRate), []);

  // fetch receiver data from store
  const receiverData = [
    {
      key: "receiverData",
      receiver: originalOrder.get("receiver_name"),
      phone: originalOrder.get("receiver_phone"),
      address: originalOrder.get("receiver_address"),
    },
  ];

  // set receiver columns
  const receiverColumns = [
    {
      title: "Receiver Information",
      children: [
        {
          title: "Receiver",
          dataIndex: "receiver",
          key: "receiver",
        },
        {
          title: "Phone",
          dataIndex: "phone",
          key: "phone",
          render: (text, record, index) => {
            return (
              <Input
                type="text"
                prefix="+86"
                size="small"
                value={text}
                bordered={false}
              />
            );
          },
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
        },
      ],
    },
  ];

  // fetch package data from store
  const [postage, setPostage] = useState(null);
  //const [exchangeRateState, setExchangeRatState] = useState(null);

  const calculatePostage = (packageType) => {
    switch (packageType) {
      case "非奶粉":
        setPostage(
          Number(
            (
              (originalOrder.get("package_weight") <= 1
                ? 1
                : Number(originalOrder.get("package_weight")).toFixed(1)) *
                normalPostage +
              1
            ).toFixed(2)
          )
        );
        break;
      case "奶粉":
        setPostage(babyFormulaPostage);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    calculatePostage(originalOrder.get("item_type"));
    //setExchangeRatState(exchangeRateInSetting);
  }, [originalOrder]);

  const packageData = [
    {
      key: "packageData",
      id: originalOrder.get("package_id"),
      type: originalOrder.get("item_type"),
      weight: originalOrder.get("package_weight"),
      count: originalOrder.get("item_count"),
      postage: postage,
      exchangeRate: exchangeRateInSetting,
    },
  ];

  // set package columns
  const packageColumns = [
    {
      title: "Package Information",

      children: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          width: "15%",
        },
        {
          title: "Weight",
          dataIndex: "weight",
          key: "weight",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                suffix="Kg"
                value={text}
                size="small"
                bordered={false}
              />
            );
          },
        },
        {
          title: "Count",
          dataIndex: "count",
          key: "count",
        },
        {
          title: "Exchange rate",
          dataIndex: "exchangeRate",
          key: "exchangeRate",
          // render: (text, record, index) => {
          //   return (
          //     <Input
          //       type="number"
          //       size="small"
          //       bordered={false}
          //       value={text}
          //       controls={false}
          //       //onChange={(e) => setExchangeRatState(e.target.value)}
          //     />
          //   );
          // },
        },
        {
          title: "Postage",
          dataIndex: "postage",
          key: "postage",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                size="small"
                prefix="$"
                bordered={false}
                value={text}
                onChange={(e) => setPostage(e.target.value)}
              />
            );
          },
        },
      ],
    },
  ];

  // fetch item data from store
  const packageWeight = Number(originalOrder.get("package_weight"));

  const itemData = originalOrder
    .get("items")
    .map((item) => ({
      key: item.split("*")[0].trim(),
      item: item.split("*")[0].trim(),
      qty: parseInt(item.split("*")[1].trim()),
      price: null,
      weight: null,
      stock: 0,
      employee: 0,
      subtotalWeight: null,
      cost: null,
      note: "",
    }))
    .toJS();

  const [itemTableData, setItemTableData] = useState([]);

  useEffect(() => {
    setItemTableData(itemData);
  }, [originalOrder]);

  const [totalWeight, setTotalWeight] = useState(0);

  const setEachWeight = (data, index) => {
    data[index]["weight"] = Number(
      (data[index]["subtotalWeight"] / data[index]["qty"]).toFixed(2)
    );
  };

  const addWeight = (data) => {
    var newTotalWeight = 0;
    data.map((item) => {
      newTotalWeight += item["subtotalWeight"];
    });
    setTotalWeight(newTotalWeight);
  };

  const calculateCost = (data, index) => {
    data[index]["cost"] = Number(
      (
        (data[index]["price"] +
          (data[index]["weight"] / packageWeight) * postage) *
        exchangeRateInSetting
      ).toFixed(2)
    );
  };

  const handleAutoFill = (index) => {
    const newData = [...itemTableData];
    newData[index]["subtotalWeight"] =
      packageWeight - totalWeight - newData[index]["subtotalWeight"] < 0
        ? 0
        : Number(
            (
              packageWeight -
              totalWeight -
              newData[index]["subtotalWeight"]
            ).toFixed(2)
          );
    setEachWeight(newData, index);
    addWeight(newData);
    calculateCost(newData, index);
    setItemTableData(newData);
  };

  const onInputChange = (key, index) => (e) => {
    const newData = [...itemTableData];
    if (key === "item" || key === "note") {
      newData[index][key] = e.target.value;
    } else {
      newData[index][key] = Number(e.target.value);
    }
    setEachWeight(newData, index);
    addWeight(newData);
    calculateCost(newData, index);
    setItemTableData(newData);
  };

  const handleAdd = () => {
    setItemTableData([
      ...itemTableData,
      {
        key: new Date().toLocaleString(),
        item: null,
        qty: null,
        price: null,
        weight: null,
        stock: 0,
        employee: 0,
        note: "",
        subtotalWeight: null,
      },
    ]);
  };

  // set item columns
  const itemColumns = [
    {
      title: "Item Information",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
          width: "20%",
          render: (text, record, index) => {
            return (
              <TextArea
                bordered={false}
                autoSize
                value={text}
                onChange={onInputChange("item", index)}
              />
            );
          },
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
          width: "10%",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                bordered={false}
                value={text}
                onChange={onInputChange("qty", index)}
              />
            );
          },
        },
        {
          title: "Price / each",
          dataIndex: "price",
          key: "price",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                prefix="$"
                bordered={false}
                min={0}
                value={text}
                onChange={onInputChange("price", index)}
              />
            );
          },
        },
        {
          title: "Weight / each",
          dataIndex: "weight",
          key: "weight",
        },
        {
          title: "Add to stock",
          dataIndex: "stock",
          key: "stock",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                min={0}
                max={
                  itemTableData[index]["qty"] - itemTableData[index]["employee"]
                }
                value={text}
                bordered={false}
                onChange={onInputChange("stock", index)}
              />
            );
          },
        },
        {
          title: "Emplyee purchase",
          dataIndex: "employee",
          key: "employee",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                min={0}
                max={
                  itemTableData[index]["qty"] - itemTableData[index]["stock"]
                }
                bordered={false}
                value={text}
                onChange={onInputChange("employee", index)}
              />
            );
          },
        },

        {
          title: "Subtotal weight",
          dataIndex: "subtotalWeight",
          key: "subtotalWeight",
          render: (text, record, index) => {
            return (
              <>
                <Input
                  type="number"
                  min={0}
                  max={packageWeight}
                  value={text}
                  bordered={false}
                  onChange={onInputChange("subtotalWeight", index)}
                />
                <Button size="small" onClick={() => handleAutoFill(index)}>
                  Auto Fill
                </Button>
              </>
            );
          },
        },
        {
          title: "Cost / each",
          dataIndex: "cost",
          key: "cost",
          render: (text, record, index) => {
            return (
              <Input
                type="text"
                prefix="￥"
                value={text}
                bordered={false}
                onChange={onInputChange("cost", index)}
              />
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
                value={text}
                autoSize
                bordered={false}
                onChange={onInputChange("note", index)}
              />
            );
          },
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          render: (text, record, index) => {
            const handleDelete = () => {
              var newData = [...itemTableData];
              newData = newData.filter(
                (item, itemIndex) => itemIndex !== index
              );
              setItemTableData(newData);
            };
            return (
              <Button size="small" onClick={handleDelete}>
                Delete
              </Button>
            );
          },
        },
      ],
    },
  ];

  // set sold columns
  const soldColumns = [
    {
      title: "Sold items",
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
      ],
    },
  ];

  // set stock columns
  const stockColumns = [
    {
      title: "Stock items",
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
      ],
    },
  ];

  // set employee columns
  const employeeColumns = [
    {
      title: "Employee items",
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
      ],
    },
  ];

  // get confirmation element ref
  const confirmationRef = useRef(null);

  const handleBack = () => {
    setShowConfirmation(false);
  };

  // set time out to let system get the height of the confirmation element
  const scrollToConfirmation = () =>
    setTimeout(() => {
      confirmationRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);

  // Fetch confirm result from store
  const confirmResultTitle = confirmResult.get("title");
  const confirmResultMessage = confirmResult.get("msg");

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header
          title="Order"
          userName="Tuantuan"
          userImage={userImage}
          cartCount="hide"
        />

        <OrderContainer>
          <SearchContainer>
            <Input
              placeholder="Please enter the package ID"
              defaultValue="PE6267860CL"
              ref={searchInputEl}
              style={{ width: "50%" }}
              onPressEnter={() =>
                handleSearch(searchInputEl.current.state.value)
              }
            />
            <Button
              style={{
                width: "10%",
                height: "50px",
                padding: "12px",
                "margin-left": "10px",
                "border-radius": "8px",
                border: "none",
                "text-align": "center",
                "background-color": "#3751ff",
                color: "white",
              }}
              onClick={() => handleSearch(searchInputEl.current.state.value)}
              loading={spinning}
            >
              Search
            </Button>
          </SearchContainer>

          <ExchangeRateWrapper href="https://www.boc.cn/sourcedb/whpj/enindex_1619.html">
            Current exchange rate:{" "}
            <Spin spinning={exchangeRateSpinning} indicator={antIcon} />
            {exchangeRate}
          </ExchangeRateWrapper>

          <Spin spinning={spinning} tip="Loading...">
            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                columns={packageColumns}
                dataSource={packageData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>

            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                columns={receiverColumns}
                dataSource={receiverData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>

            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={itemColumns}
                dataSource={itemTableData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <BtnWrapper>
              <Btn onClick={handleAdd}>Add</Btn>
              <Button
                loading={submitLoading}
                onClick={() => {
                  handleSubmit({
                    items: itemTableData,
                    package: packageData[0],
                  });
                  scrollToConfirmation();
                }}
                style={{
                  width: "10%",
                  height: "50px",
                  padding: "12px",
                  "margin-left": "10px",
                  "border-radius": "8px",
                  border: "none",
                  "text-align": "center",
                  "background-color": "#3751ff",
                  color: "white",
                }}
              >
                Submit
              </Button>
            </BtnWrapper>
          </Spin>
          <ConfirmationContainer ref={confirmationRef}>
            <ConfirmationWrapper className={showConfirmation ? "" : "hide"}>
              <Spin spinning={confirmationSpinning} tip="Loading...">
                <TableWrapper
                  className={
                    confirmationData["sold"].length === 0 ? "hide" : ""
                  }
                >
                  <Table
                    style={{ width: "100%" }}
                    columns={soldColumns}
                    dataSource={confirmationData["sold"]}
                    pagination={{ position: ["none", "none"] }}
                    bordered
                    size="small"
                  />
                </TableWrapper>
                <TableWrapper
                  className={
                    confirmationData["stock"].length === 0 ? "hide" : ""
                  }
                >
                  <Table
                    style={{ width: "100%" }}
                    columns={stockColumns}
                    dataSource={confirmationData["stock"]}
                    pagination={{ position: ["none", "none"] }}
                    bordered
                    size="small"
                  />
                </TableWrapper>
                <TableWrapper
                  className={
                    confirmationData["employee"].length === 0 ? "hide" : ""
                  }
                >
                  <Table
                    style={{ width: "100%" }}
                    columns={employeeColumns}
                    dataSource={confirmationData["employee"]}
                    pagination={{ position: ["none", "none"] }}
                    bordered
                    size="small"
                  />
                </TableWrapper>
                <BtnWrapper>
                  <Btn onClick={handleBack}>Back</Btn>
                  <Button
                    style={{
                      width: "10%",
                      height: "50px",
                      padding: "12px",
                      "margin-left": "10px",
                      "border-radius": "8px",
                      border: "none",
                      "text-align": "center",
                      "background-color": "#3751ff",
                      color: "white",
                    }}
                    loading={confirmLoading}
                    onClick={() => handleConfirm(confirmationData)}
                  >
                    Confirm
                  </Button>
                </BtnWrapper>
              </Spin>
            </ConfirmationWrapper>
          </ConfirmationContainer>
        </OrderContainer>
      </Right>
      <BackTop />

      <Modal
        title={confirmResultTitle}
        visible={showConfirmationResultDialog}
        okText="Place new order"
        cancelText="Close"
        style={{ top: "20px" }}
        onOk={handleOnOk}
        onCancel={() => setShowConfirmationResultDialog(false)}
      >
        <p>{confirmResultMessage}</p>
      </Modal>
    </Container>
  );
};

const mapState = (state) => ({
  originalOrder: state.getIn(["order", "originalOrder"]),
  spinning: state.getIn(["order", "spinning"]),
  exchangeRate: state.getIn(["order", "exchangeRate"]),
  exchangeRateSpinning: state.getIn(["order", "exchangeRateSpinning"]),
  submitLoading: state.getIn(["order", "submitLoading"]),
  confirmLoading: state.getIn(["order", "confirmLoading"]),
  showConfirmation: state.getIn(["order", "showConfirmation"]),
  confirmationSpinning: state.getIn(["order", "confirmationSpinning"]),
  confirmationData: state.getIn(["order", "confirmationData"]).toJS(),
  showConfirmationResultDialog: state.getIn([
    "order",
    "showConfirmationResultDialog",
  ]),
  confirmResult: state.getIn(["order", "confirmResult"]),
  normalPostage: state.getIn(["order", "normalPostage"]),
  babyFormulaPostage: state.getIn(["order", "babyFormulaPostage"]),
  exchangeRateInSetting: state.getIn(["order", "exchangeRateInSetting"]),
});

const mapDispatch = (dispatch) => ({
  handleSearch(pk_id) {
    if (pk_id.trim().length === 0) {
      message.warning("Input must not be null!");
    } else {
      dispatch(actionCreators.searchAction(pk_id));
    }
  },

  initializeExchangeRate(exchangeRate) {
    if (exchangeRate === "") {
      dispatch(actionCreators.initializeExchangeRateAction);
    }
  },

  handleSubmit(tableData) {
    dispatch(actionCreators.submitTableDataAction(tableData));
  },

  handleConfirm(confirmationData) {
    dispatch(actionCreators.saveConfirmationDataAction(confirmationData));
  },

  setShowConfirmation(value) {
    dispatch({ type: actionTypes.SHOW_CONFIRMATION, value: fromJS(value) });
  },

  handleOnOk() {
    dispatch(actionCreators.handleOnOkAction);
  },

  setShowConfirmationResultDialog(value) {
    dispatch({
      type: actionTypes.SHOW_CONFIRMATION_RESULT_DIALOG,
      value: fromJS(value),
    });
  },

  initializeSettings() {
    dispatch(actionCreators.initializeSettingsAction);
  },
});

export default connect(mapState, mapDispatch)(OrderPage);
