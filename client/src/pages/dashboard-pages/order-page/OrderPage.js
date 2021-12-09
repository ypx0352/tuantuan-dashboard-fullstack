import React, { useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Table, Input, InputNumber, Spin, message, BackTop } from "antd";
import "antd/dist/antd.css";
import Sidebar from "../static/Sidebar";
import userImage from "../../../image/tuan-logo.jpeg";
import { actionCreators } from "./store";

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
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 60%;
  line-height: 30px;
  padding: 5px;
  border: 1px solid #9fa2b4;
  border-radius: 5px;
  background-color: #fcfdfe;
  outline: none;
  margin-top: 5px;
  font-weight: bold;
  ::placeholder {
    color: #9fa2b4;
    font-weight: normal;
  }
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
  justify-content: center;
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

const itemColumns = [
  {
    title: "Item Information",
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
        title: "Price / each(AUD)",
        dataIndex: "cost",
        key: "cost",
      },
      {
        title: "Weight / each(Kg)",
        dataIndex: "weight",
        key: "weight",
      },
      {
        title: "Add to stock",
        dataIndex: "stock",
        key: "stock",
      },
      {
        title: "Emplyee purchase",
        dataIndex: "employee",
        key: "employee",
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
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
      key: "1",
      receiver: originalOrder.get("receiver_name"),
      phone: originalOrder.get("receiver_phone"),
      address: originalOrder.get("receiver_address"),
    },
  ];

  // fetch package data from store
  const packageData = [
    {
      key: "1",
      id: originalOrder.get("package_id"),
      type: originalOrder.get("item_type"),
      weight: originalOrder.get("package_weight"),
      count: originalOrder.get("item_count"),
    },
  ];

  // fetch item data from store
  const { TextArea } = Input;
  var itemData = [];
  originalOrder.get("items").map((item, index) => {
    itemData.push({
      key: index,
      item: <TextArea defaultValue={item.split("*")[0].trim()} autoSize />,
      qty: parseInt(item.split("*")[1].trim()),
      weight: <InputNumber type="number" controls={false} />,
      cost: <InputNumber type="number" controls={false} />,
      stock: (
        <InputNumber
          type="number"
          defaultValue={0}
          min={0}
          max={parseInt(item.split("*")[1].trim())}
        />
      ),
      employee: (
        <InputNumber
          type="number"
          defaultValue={0}
          min={0}
          max={parseInt(item.split("*")[1].trim())}
        />
      ),
      note: <TextArea autoSize />,
    });
  });

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
            <SearchInput
              placeholder="Please enter the package ID"
              ref={searchInputEl}
            />
            <SearchBtn
              onClick={() => handleSearch(searchInputEl.current.value)}
            >
              Search
            </SearchBtn>
          </SearchContainer>
          <Spin spinning={spinning} tip="Loading">
            <TableWrapper>
              <Table
                style={{ width: "70%" }}
                columns={receiverColumns}
                dataSource={receiverData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <TableWrapper>
              <Table
                style={{ width: "70%" }}
                columns={packageColumns}
                dataSource={packageData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <TableWrapper>
              <Table
                style={{ width: "70%" }}
                columns={itemColumns}
                dataSource={itemData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <SubmitWrapper>
              <SubmitBtn>Submit</SubmitBtn>
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
