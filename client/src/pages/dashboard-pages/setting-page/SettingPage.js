import React from "react";
import styled from "styled-components";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";

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
  justify-content: space-between;
`;

const SettingPage = () => {
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
            <span>Update</span>
            <span>Current value</span>
            <span>Last modified time</span>
            <span>New value</span>
            <span>Action</span>
          </Title>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

export default SettingPage;
