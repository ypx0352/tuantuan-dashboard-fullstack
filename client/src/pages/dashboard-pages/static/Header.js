import React from "react";
import styled from "styled-components";


const Container = styled.div`
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

const Header = (props) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <UserWrapper>
        <Name>{props.userName}</Name>
        <UserImage src={props.userImage}></UserImage>
      </UserWrapper>
    </Container>
  );
};

export default Header;
