import React from "react";
import styled from "styled-components";
import userImage from "../../../image/tuan-logo.jpeg";
import Sidebar from "../static/Sidebar";

const Container = styled.div`
  display: flex;
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
        <Sidebar/>
      </Left>
      <Right>
        <Header>
          <Title>Overview</Title>
          <UserWrapper>
            <Name>Tuantuan</Name>
            <UserImage src={userImage}></UserImage>
          </UserWrapper>
        </Header>
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
