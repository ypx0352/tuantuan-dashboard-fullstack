import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { Button, Input, Table } from "antd";
import { actionCreators } from "./store";

const Container = styled.div`
  display: flex;
  min-width: 930px;
  min-height: 100vh;
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
  add: "#18a16d",
  submit: "#145DA0",
  reset: "#DF362D",
  cancel: "#189AB4",
  update: "#145DA0",
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

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0;
  justify-content: center;
  align-items: center;
`;

const PackagePage = (props) => {
  const { searchPackage } = props;
  const [searchInput, setSearchInput] = useState();

  const tableData = []
  const tableColumns = []


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
              columns={tableColumns}
              rowKey={(record) => record._id}
              dataSource={tableData}
            />
          </TableWrapper>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({});

const mapDispatch = (dispatch) => ({
  searchPackage(pk_id) {
    dispatch(actionCreators.searchPackageAction(pk_id));
  },
});

export default connect(mapState, mapDispatch)(PackagePage);
