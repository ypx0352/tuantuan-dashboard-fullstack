import React from "react";
import styled from "styled-components";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";

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
  background-color: white;
  :hover {
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

const Diagram = styled.div``;

const OverviewPage = () => {
  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header
          title="Overview"
          userName="Tuantuan"
          userImage={userImage}
          cartCount="hide"
        />

        <BlockWrapper>
          <Block>
            <BlockTitle>Unresolved Order</BlockTitle>
            <BlockContent>60</BlockContent>
          </Block>
          <Block>
            <BlockTitle>Unresolved Checkout</BlockTitle>
            <BlockContent>60</BlockContent>
          </Block>
          <Block>
            <BlockTitle>Stock</BlockTitle>
            <BlockContent>60</BlockContent>
          </Block>
          <Block>
            <BlockTitle>Exception</BlockTitle>
            <BlockContent>60</BlockContent>
          </Block>
        </BlockWrapper>
        <Diagram>Diagram here</Diagram>
      </Right>
    </Container>
  );
};

export default OverviewPage;
