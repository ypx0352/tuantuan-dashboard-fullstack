import React from "react";
import styled from "styled-components";
import { Table, Input } from "antd";
import "antd/dist/antd.css";
import Sidebar from "../static/Sidebar";
import userImage from "../../../image/tuan-logo.jpeg";

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
const ResultWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const ReviewContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  //justify-content: center;
  //align-items: center;
  padding: 20px;
  background-color: white;
  overflow: auto;
  -webkit-box-shadow: 0px 0px 20px -6px #000000;
  box-shadow: 0px 0px 20px -6px #000000;
`;

const ReceiverContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  align-items: flex-start;
  border-bottom: 1px solid #9fa2b4;
`;
const RowWrapper = styled.div`
  display: flex;
  padding-top: 5px;
  align-items: baseline;
`;

const Attribute = styled.span`
  font-weight: bold;
  color: #3751ff;
`;
const Value = styled.span`
  font-weight: bold;
  margin-left: 5px;
  margin-right: 20px;
`;
const PackageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemInput = styled.input`
  width: 350px;
  padding-left: 5px;
  border: none;
  outline: none;
  border-bottom: 1px solid grey;
  margin-right: 10px;
`;
const CostInput = styled.input`
  width: 35px;
  padding-left: 5px;
  border: none;
  outline: none;
  border-bottom: 1px solid grey;
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

const receiverData = [
  {
    key: "1",
    receiver: "张亚楠",
    phone: "18561510937",
    address: "山东青岛胶州绿城朗月苑南区9号楼1单元401",
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

const packageData = [
  {
    key: "1",
    id: "PE6114416CL",
    type: "非奶粉",
    weight: "3.80",
    count: "12",
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
        dataIndex: "cost",
        key: "cost",
      },
      {
        title: "Emplyee purchase",
        dataIndex: "cost",
        key: "cost",
      },
    ],
  },
];

const itemData = [
  {
    key: "1",
    item: "Rafferty's Garden 混合果泥 120g 6+",
    qty: "7",
    weight: <Input type="number" />,
    cost: <Input type="number" />,
  },
  {
    key: "1",
    item: "Plenty 核桃油 375ml ",
    qty: "1",
    weight: <Input type="number" />,
    cost: <Input type="number" />,
  },
  {
    key: "1",
    item: "HIMALAYAN 粉盐 370g",
    qty: "1",
    weight: <Input type="number" />,
    cost: <Input type="number" />,
  },
  {
    key: "1",
    item: "Total",
    qty: 9,
    weight: <Input type="number" />,
    cost: <Input type="number" />,
  },
];

const OrderPage = () => {
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
            <SearchInput placeholder="Please enter the package ID" />
            <SearchBtn>Search</SearchBtn>
          </SearchContainer>
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
        </OrderContainer>
      </Right>
    </Container>
  );
};

export default OrderPage;
