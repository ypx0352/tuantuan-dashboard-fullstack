import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Table, Input, Spin, message, BackTop, Button } from "antd";
import "antd/dist/antd.css";
import Sidebar from "../static/Sidebar";
import userImage from "../../../image/tuan-logo.jpeg";
import { actionCreators } from "./store";

const { TextArea } = Input;

const Container = styled.div`
  display: flex;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const Left = styled.div`
  width: 20%;
`;

const Right = styled.div`
  width: 80%;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
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

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const SearchBtn = styled.div`
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

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SubmitBtn = styled.div`
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

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

// set table columns
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
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
    ],
  },
];

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
      },
      {
        title: "Weight(Kg)",
        dataIndex: "weight",
        key: "weight",
      },
      {
        title: "Count",
        dataIndex: "count",
        key: "count",
      },
    ],
  },
];

const OrderPage = (props) => {
  const { originalOrder, handleSearch, spinning } = props;

  const searchInputEl = useRef(null);

  // fetch receiver data from store
  const receiverData = [
    {
      key: "receiverData",
      receiver: originalOrder.get("receiver_name"),
      phone: originalOrder.get("receiver_phone"),
      address: originalOrder.get("receiver_address"),
    },
  ];

  // fetch package data from store
  const packageData = [
    {
      key: "packageData",
      id: originalOrder.get("package_id"),
      type: originalOrder.get("item_type"),
      weight: originalOrder.get("package_weight"),
      count: originalOrder.get("item_count"),
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
      note: "",
      subtotalWeight: null,
    }))
    .toJS();

  const [itemTableData, setItemTableData] = useState([]);

  useEffect(() => {
    setItemTableData(itemData);
  }, [originalOrder]);

  const [totalWeight, setTotalWeight] = useState(0);

  const setEachWeight = (data, index) => {
    data[index]["weight"] = data[index]["subtotalWeight"] / data[index]["qty"];
  };

  const addWeight = (data) => {
    var newTotalWeight = 0;
    data.map((item) => {
      newTotalWeight += item["subtotalWeight"];
    });
    setTotalWeight(newTotalWeight);
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
    setItemTableData(newData);
  };

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
                controls={false}
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
            const handleAutoFill = (index) => {
              const newData = [...itemTableData];
              newData[index]["subtotalWeight"] =
                packageWeight - totalWeight - newData[index]["subtotalWeight"] <
                0
                  ? 0
                  : packageWeight -
                    totalWeight -
                    newData[index]["subtotalWeight"];
              setEachWeight(newData, index);
              addWeight(newData);
              setItemTableData(newData);
            };
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
          title: "Note",
          dataIndex: "note",
          key: "note",
          render: (text, record, index) => {
            return (
              <Input
                type="text"
                value={text}
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

  const handleSubmit = () => {
    console.log(itemTableData, packageData[0]);
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

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header>
          <Title>Order</Title>
          <UserWrapper>
            <Name>Tuantuan</Name>
            <UserImage src={userImage}></UserImage>
          </UserWrapper>
        </Header>
        <OrderContainer>
          <SearchContainer>
            <Input
              placeholder="Please enter the package ID"
              defaultValue="PE6247631CL"
              ref={searchInputEl}
              style={{ width: "50%" }}
              onPressEnter={() =>
                handleSearch(searchInputEl.current.state.value)
              }
            />
            <SearchBtn
              onClick={() => handleSearch(searchInputEl.current.state.value)}
            >
              Search
            </SearchBtn>
          </SearchContainer>
          <Spin spinning={spinning} tip="Loading">
            <TableWrapper>
              <Table
                style={{ width: "50%" }}
                columns={packageColumns}
                dataSource={packageData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
              <Table
                style={{ width: "50%" }}
                columns={receiverColumns}
                dataSource={receiverData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                columns={itemColumns}
                dataSource={itemTableData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <SubmitWrapper>
              <SubmitBtn onClick={handleAdd}>Add</SubmitBtn>
              <SubmitBtn onClick={handleSubmit}>Submit</SubmitBtn>
            </SubmitWrapper>
          </Spin>
        </OrderContainer>
      </Right>
      <BackTop />
    </Container>
  );
};

const mapState = (state) => ({
  originalOrder: state.getIn(["order", "originalOrder"]),
  spinning: state.getIn(["order", "spinning"]),
});

const mapDispatch = (dispatch) => ({
  handleSearch(pk_id) {
    if (pk_id.trim().length === 0) {
      message.warning("Input must not be null!");
    } else {
      dispatch(actionCreators.searchAction(pk_id));
    }
  },
});

export default connect(mapState, mapDispatch)(OrderPage);
