import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { Button, Input, Table, Steps, Spin, message, Select } from "antd";
import { actionCreators } from "./store";
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

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
  width: 100%;
  padding: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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

const PackageTagContainer = styled.div`
  width: 55%;
  margin: 0 auto 20px auto;
`;

const PackageTagHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PackageTagWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const colors = {
  search: "#3751ff",
  sold: "darkgreen",
  stock: "sandybrown",
  employee: "#18a16d",
  exception: "#DF362D",
  奶粉: "#E8B4B8",
  非奶粉: "#189AB4",
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

const PackageTag = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  color: white;
  border-radius: 8px;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  &.hide {
    display: none;
  }
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  &.hide {
    display: none;
  }
`;

const PackagePage = (props) => {
  const {
    searchPackage,
    tableData,
    tablesDisplayed,
    tableSpinning,
    getLatestPackages,
    latestPackagesSpinning,
    latestPackages,
  } = props;
  const [searchInput, setSearchInput] = useState();
  const [tableDataState, setTableDataState] = useState({});
  const [latestPackagesState, setLatestPackagesState] = useState([]);

  useEffect(() => {
    getLatestPackages();
  }, []);

  useEffect(() => {
    setTableDataState(tableData);
  }, [tableData]);

  useEffect(() => setLatestPackagesState(latestPackages), [latestPackages]);

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

  const generateStep = () => {
    return tableDataState.trackData?.length === 0 ? (
      <span>Loading...</span>
    ) : (
      <Steps
        current={tableDataState.trackData?.length - 1}
        direction="vertical"
        size="small"
      >
        {tableDataState.trackData?.map((item) => (
          <Step title={item.message} description={item.time} />
        ))}
      </Steps>
    );
  };

  const generatePackageTag = () => {
    return latestPackagesState.map((item) => (
      <PackageTag type={item.type} onClick={() => searchPackage(item.id)}>
        {item.id} {item.receiver}
      </PackageTag>
    ));
  };

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
            <span>PE6420948BB</span>
            <StyledInput
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={() => searchPackage(searchInput.trim())}
            />
            <StyledButton
              type="search"
              onClick={() => searchPackage(searchInput.trim())}
              loading={tableSpinning}
            >
              Search
            </StyledButton>
          </SearchContainer>
          <Spin spinning={latestPackagesSpinning} tip="Loading...">
            <PackageTagContainer>
              <PackageTagHeaderWrapper>
                <h3>
                  Recently added packages: last{" "}
                  <Select
                    defaultValue={10}
                    onChange={(e) => getLatestPackages(e)}
                  >
                    <Option key="10" value="10">
                      10
                    </Option>
                    <Option key="20" value="20">
                      20
                    </Option>
                    <Option key="30" value="30">
                      30
                    </Option>
                  </Select>{" "}
                  packages
                </h3>
              </PackageTagHeaderWrapper>

              <PackageTagWrapper>{generatePackageTag()}</PackageTagWrapper>
            </PackageTagContainer>
          </Spin>
          <Spin spinning={tableSpinning} tip="Loading...">
            <TableWrapper className={tablesDisplayed ? "" : "hide"}>
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
            <TableWrapper className={tablesDisplayed ? "" : "hide"}>
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
            <TableWrapper className={tablesDisplayed ? "" : "hide"}>
              <Table
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={itemColumns}
                rowKey={(record) => record._id}
                dataSource={tableDataState.itemData}
                bordered
              />
            </TableWrapper>
            <StepWrapper className={tablesDisplayed ? "" : "hide"}>
              <h3>Track</h3>
              {generateStep()}
            </StepWrapper>
          </Spin>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  tableData: state.getIn(["package", "tableData"]).toJS(),
  tablesDisplayed: state.getIn(["package", "tablesDisplayed"]),
  tableSpinning: state.getIn(["package", "tableSpinning"]),
  latestPackagesSpinning: state.getIn(["package", "latestPackagesSpinning"]),
  latestPackages: state.getIn(["package", "latestPackages"]).toJS(),
});

const mapDispatch = (dispatch) => ({
  searchPackage(pk_id) {
    if (pk_id === undefined) {
      return message.warn("Input must not be null.");
    }
    dispatch(actionCreators.searchPackageAction(pk_id));
  },

  getLatestPackages(limit) {
    dispatch(actionCreators.getLatestPackagesAction(limit));
  },
});

export default connect(mapState, mapDispatch)(PackagePage);
