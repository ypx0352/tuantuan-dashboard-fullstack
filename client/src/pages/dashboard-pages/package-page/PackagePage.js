import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { Button, Input, Table, Steps } from "antd";
import { actionCreators } from "./store";
const { TextArea } = Input;
const {Step} = Steps;

const Container = styled.div`
  display: flex;
  min-width: 930px;
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
  padding: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const StyledInput = styled(Input).attrs({
  placeholder: "Please enter package ID",
})`
  width: 50%;
  ::placeholder {
    color: grey;
  }
`;

const colors = {
  search: "#3751ff",
  sold: "darkgreen",
  stock: "sandybrown",
  employee: "#18a16d",
  exception: "#DF362D",
};

const StyledButton = styled(Button).attrs((props) => ({
  style: {
    width: "10%",
    "min-width": "65px",
    height: "50px",
    padding: "12px",
    "margin-left": "10px",
    "border-radius": "8px",
    border: "none",
    "text-align": "center",
    "background-color": colors[props.type],
    color: "white",
  },
}))``;

const StyledSpan = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 10px;
  color: white;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StepWrapper = styled.div`
  /* display: flex;
  flex-direction: column; */
  /* justify-content: center; */
  /* align-items: center; */
`;

const PackagePage = (props) => {
  const { searchPackage, tableData } = props;
  const [searchInput, setSearchInput] = useState();
  const [tableDataState, setTableDataState] = useState({});

  useEffect(() => {
    setTableDataState(tableData);
  }, [tableData]);

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
          render: (text) => text + " Kg",
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
        },
        {
          title: "Postage",
          dataIndex: "postage",
          key: "postage",
          render: (text) => "$ " + text,
        },
      ],
    },
  ];

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
          render: (text) => "+86 " + text,
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
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
          width: "20%",
          render: (text) => {
            return <TextArea bordered={false} autoSize value={text} />;
          },
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
          width: "10%",
          render: (text) => {
            return <Input type="number" bordered={false} value={text} />;
          },
        },
        {
          title: "Price / each",
          dataIndex: "price",
          key: "price",
          render: (text) => "$ " + text,
        },
        {
          title: "Weight / each",
          dataIndex: "weight",
          key: "weight",
          render: (text) => text + " Kg",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          render: (text) => <StyledSpan type={text}>{text}</StyledSpan>,
        },
        {
          title: "Cost / each",
          dataIndex: "cost",
          key: "cost",
          render: (text) => "￥ " + text,
        },
        {
          title: "Note",
          dataIndex: "note",
          key: "note",
          render: (text, record, index) => {
            return <TextArea value={text} autoSize bordered={false} />;
          },
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
        <Header
          title="Package"
          userName="Tuantuan"
          userImage={userImage}
          cartCount="hide"
        />
        <ContentWrapper>
          <SearchContainer>
            <StyledInput onChange={(e) => setSearchInput(e.target.value)} />
            <StyledButton
              type="search"
              onClick={() => searchPackage(searchInput)}
            >
              Search
            </StyledButton>
          </SearchContainer>
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              tableLayout="auto"
              columns={packageColumns}
              rowKey={(record) => record.id}
              dataSource={tableDataState.packageData}
              pagination={false}
              bordered
            />
          </TableWrapper>
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              tableLayout="auto"
              columns={receiverColumns}
              rowKey={(record) => record.receiver}
              dataSource={tableDataState.receiverData}
              pagination={false}
              bordered
            />
          </TableWrapper>
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              tableLayout="auto"
              columns={itemColumns}
              rowKey={(record) => record._id}
              dataSource={tableDataState.itemData}
              bordered
            />
          </TableWrapper>
          <StepWrapper>
            <Steps  current={4} direction="vertical">
              <Step
                title="Finished"
                description="This is a description. This is a description."
              />
              <Step
                title="Finished"
                description="This is a description. This is a description."
              />
              <Step
                title="In Progress"
                description="This is a description. This is a description."
              />
              <Step title="Waiting" description="This is a description." />
              <Step title="Waiting" description="This is a description." />
            </Steps>
          </StepWrapper>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  tableData: state.getIn(["package", "tableData"]).toJS(),
});

const mapDispatch = (dispatch) => ({
  searchPackage(pk_id) {
    dispatch(actionCreators.searchPackageAction(pk_id));
  },
});

export default connect(mapState, mapDispatch)(PackagePage);
