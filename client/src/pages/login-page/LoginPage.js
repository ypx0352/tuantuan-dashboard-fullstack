import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Logo from "../../image/tuan-logo.jpeg";
import { actionCreators } from "./store";

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const Wrapper = styled.div`
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  overflow: auto;
  -webkit-box-shadow: 0px 0px 20px -6px #000000;
  box-shadow: 0px 0px 20px -6px #000000;
`;

const LogoImage = styled.img`
  width: 30%;
`;

const LogoText = styled.div`
  font-weight: bold;
  font-style: 19px;
  color: #a4a6b3;
`;

const Title = styled.h1`
  font-style: 24px;
  font-weight: bold;
`;

const Subtitle = styled.div`
  font-style: 14px;
  color: #9fa2b4;
`;

const InputWrapper = styled.div`
  width: 300px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Label = styled.label`
  width: 100%;
  font-weight: bold;
  color: #9fa2b4;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
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

const ForgotPassword = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  font-weight: bold;
  color: #9fa2b4;
`;

const ShowPassword = styled.span`
  position: absolute;
  right: 0;
  top: 52%;
  color: #9fa2b4;
  cursor: pointer;
`;

const Button = styled.button`
  width: 312px;
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  border: none;
  background-color: #3751ff;
  cursor: pointer;
  color: white;
`;

const TextWrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Text = styled.div``;
const Link = styled.a`
  margin-left: 5px;
  color: #3751ff;
  font-weight: bold;
  text-decoration: none;
`;

const LoginPage = (props) => {
  const { showPassword, handleShowPassword } = props;
  return (
    <Container>
      <Wrapper>
        <LogoImage src={Logo}></LogoImage>
        <LogoText>Tuantuan Dashboard</LogoText>
        <Title>Log In to Dashboard</Title>
        <Subtitle>Enter your email and password below</Subtitle>
        <InputWrapper>
          <Label>EMAIL</Label>
          <Input placeholder="Email address" type="text" />
        </InputWrapper>
        <InputWrapper>
          <Label>PASSWORD</Label>
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
          />
          <ForgotPassword>Forgot password?</ForgotPassword>
          <ShowPassword
            className="material-icons-outlined"
            onClick={() => handleShowPassword(!showPassword)}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </ShowPassword>
        </InputWrapper>
        <Button>Log In</Button>
        <TextWrapper>
          <Text>Don't have an account?</Text>
          <Link href="/register">Sign up</Link>
        </TextWrapper>
      </Wrapper>
    </Container>
  );
};

const mapState = (state) => ({
  showPassword: state.getIn(["login", "showPassword"]),
});

const mapDispatch = (dispatch) => ({
  handleShowPassword(showPassword) {
    dispatch(actionCreators.showPassword(showPassword));
  },
});

export default connect(mapState, mapDispatch)(LoginPage);
