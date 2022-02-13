import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Button, InputNumber } from "antd";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { actionCreators } from "./store";

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

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #363740;
  font-weight: bold;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #363740;
  padding: 10px 0;
`;

const SettingPage = (props) => {
  const { getSettings, settings, updateSetting } = props;

  useEffect(() => getSettings(), []);

  const newSettings = {};

  const handleInput = (name) => (e) => {
    newSettings[`${name}`] = e;
  };

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header
          title="Setting"
          userName="Tuantuan"
          userImage={userImage}
          cartCount="hide"
        />
        <ContentWrapper>
          <Title>
            <span style={{ width: "30%" }}></span>
            <span style={{ width: "18%" }}>Current value</span>
            <span style={{ width: "25%" }}>Last updated at </span>
            <span style={{ width: "21%" }}>New value</span>
            <span>Action</span>
          </Title>
          <Item>
            <span style={{ width: "22%" }}>
              Standard item postage (each Kg)
            </span>
            <span>{settings.get("normalPostage").get("value")}</span>
            <span>
              {new Date(
                settings.get("normalPostage").get("updatedAt")
              ).toLocaleString()}
            </span>
            <InputNumber
              size="small"
              controls={false}
              defaultValue={null}
              value={newSettings.normalPostage}
              onChange={handleInput("normalPostage")}
            />
            <Button
              size="small"
              onClick={() =>
                updateSetting("normalPostage", newSettings["normalPostage"])
              }
            >
              Update
            </Button>
          </Item>
          <Item>
            <span style={{ width: "22%" }}>Baby formula postage (3 cans)</span>
            <span>{settings.get("babyFormulaPostage").get("value")}</span>
            <span>
              {new Date(
                settings.get("babyFormulaPostage").get("updatedAt")
              ).toLocaleString()}
            </span>
            <InputNumber
              size="small"
              controls={false}
              defaultValue={null}
              onChange={handleInput("babyFormulaPostage")}
            />
            <Button
              size="small"
              onClick={() =>
                updateSetting(
                  "babyFormulaPostage",
                  newSettings["babyFormulaPostage"]
                )
              }
            >
              Update
            </Button>
          </Item>
          <Item>
            <span style={{ width: "22%" }}>Exchange rate (AUD:RMB)</span>
            <span>{settings.get("exchangeRateInSetting").get("value")}</span>
            <span>
              {new Date(
                settings.get("exchangeRateInSetting").get("updatedAt")
              ).toLocaleString()}
            </span>
            <InputNumber
              size="small"
              controls={false}
              defaultValue={null}
              onChange={handleInput("exchangeRateInSetting")}
            />
            <Button
              size="small"
              onClick={() =>
                updateSetting(
                  "exchangeRateInSetting",
                  newSettings["exchangeRateInSetting"]
                )
              }
            >
              Update
            </Button>
          </Item>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  settings: state.getIn(["setting", "settings"]),
});

const mapDispatch = (dispatch) => ({
  getSettings() {
    dispatch(actionCreators.getSettingsAction);
  },

  updateSetting(name, value) {
    dispatch(actionCreators.updateSettingAction(name, value));
  },
});

export default connect(mapState, mapDispatch)(SettingPage);
