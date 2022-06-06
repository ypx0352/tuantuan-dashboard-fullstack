import React, { Children, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { Table, Input, Radio, Badge } from "antd";
import { actionCreators as settingActionCreators } from "../setting-page/store";

const PageContainer = styled.div`
  display: flex;
  min-width: 1200px;
  min-height: 100vh;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const Left = styled.div`
  max-width: 15%;
`;

const Right = styled.div`
  min-width: 88%;
  padding: 5px 10px;
  &.expand {
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CostCalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const PriceCalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  &.hide {
    display: none;
  }
`;

const ToolPage = (props) => {
  const { showSidebar, getSettings } = props;

  useEffect(() => {
    getSettings();
  }, []);

  const typeOptions = [
    { label: "Normal item", value: "normal" },
    { label: "Baby formula", value: "baby formula" },
  ];

  const costColumns = [
    {
      title: "Cost calculator",
      children: [
        {
          title: "Price / unit",
          key: "price",
          dataIndex: "price",
          render: () => <Input type="number" suffix="AUD" min={0} />,
        },
        {
          title: "Qty",
          key: "qty",
          dataIndex: "qty",
          render: () => <Input type="number" min={0} />,
        },
        {
          title: "Weight / unit",
          key: "qty",
          dataIndex: "qty",
          render: () => <Input type="number" suffix="Kg" min={0} />,
        },
        {
          title: "Type",
          key: "type",
          dataIndex: "type",
          render: () => (
            <Radio.Group
              options={typeOptions}
              optionType="button"
              buttonStyle="solid"
            />
          ),
        },
        {
          title: "Extra postage in AU",
          key: "price",
          dataIndex: "price",
          render: () => (
            <Input type="number" suffix="AUD" min={0} defaultValue={0} />
          ),
        },
        {
          title: "Domestic postage",
          key: "price",
          dataIndex: "price",
          render: () => (
            <Input type="number" suffix="RMB" min={0} defaultValue={0} />
          ),
        },
        {
          title: "Subtotal",
          key: "subtotal",
          dataIndex: "subtotal",
          render: (text) => (
            <span style={{ fontWeight: "bold", color: "green" }}>
              ￥ {text}
            </span>
          ),
        },
      ],
    },
  ];

  const costData = [
    { exchangeRate: 4.85, standardPostage: 8.5, babyFormulaPostage: 20 },
  ];

  return (
    <PageContainer>
      <Left>
        <Sidebar selected="tool" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Tool" cartCount="hide" />
        <ContentWrapper>
          <CostCalculatorContainer>
            <h2>Cost Calculator</h2>
            <TableWrapper>
              <Badge.Ribbon text="Latest exchange and postage rate" color={"green"}>
                <Table
                  styled={{ width: "100px" }}
                  tableLayout="auto"
                  columns={costColumns}
                  dataSource={costData}
                  pagination={{ position: ["none", "none"] }}
                  bordered
                />
              </Badge.Ribbon>
            </TableWrapper>
          </CostCalculatorContainer>
          <PriceCalculatorContainer>
            <h2>Price Calculator</h2>
          </PriceCalculatorContainer>
        </ContentWrapper>
      </Right>
    </PageContainer>
  );
};
const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
});
const mapDispatch = (dispatch) => ({
  getSettings() {
    dispatch(settingActionCreators.getSettingsAction);
  },
});

export default connect(mapState, mapDispatch)(ToolPage);
