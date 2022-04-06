import React from "react";
import styled from "styled-components";
import Koala from "../../image/koala.png";
import Bg from "../../image/landing-page-bg.jpeg";

const Container = styled.div`
  height: 100vh;
  margin: 15px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Ubuntu", sans-serif;
  position: relative;
  background-image: url(${Bg});
  background-size: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

const Left = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  width: 50%;
  font-size: 70px;
  font-weight: bold;
  color: #332620;
`;

const Subtitle = styled.span`
  width: 50%;
  margin-top: 20px;
  font-size: 30px;
  color: crimson;
`;

const Wrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Button = styled.a`
  margin-top: 50px;
  font-size: 20px;
  padding: 10px 15px;
  background-color: #50382e;
  color: white;
  text-align: center;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  text-decoration: none;
  :hover {
    color: green;
  }
`;

const Right = styled.div`
  width: 40%;
`;

const Image = styled.img`
  width: 100%;
`;

const LandingPage = () => {
  return (
    <Container>
      <Left>
        <Title>Tuantuan Dashboard</Title>
        <Subtitle>Easy business, happy life.</Subtitle>
        <Wrapper>
          <Button href="/login">GET STARTED</Button>
        </Wrapper>
      </Left>
      <Right>
        <Image src={Koala}></Image>
      </Right>
    </Container>
  );
};

export default LandingPage;
