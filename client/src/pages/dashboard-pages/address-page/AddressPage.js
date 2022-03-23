import React, { useState } from "react";
import styled from "styled-components";
import { Table, Input, Button, Form, Select } from "antd";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { data, province, city, area } from "province-city-china/data";
const { Option } = Select;

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
  placeholder: "Please enter the receiver's name",
})`
  width: 50%;
  ::placeholder {
    color: grey;
  }
`;

const colors = { search: "#3751ff", add: "#18a16d", submit: "#145DA0" };

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

const FormWrapper = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center; */

  margin: 0 25%;
`;

// const FormItem = styled(Form.Item)`
//     width:100%
// `

// const StyledList = styled.ul`
//   list-style-type: none;
// `;

const tableColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Province", dataIndex: "province", key: "province" },
  { title: "City", dataIndex: "city", key: "city" },
  { title: "District", dataIndex: "district", key: "district" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Create at", dataIndex: "createAt", key: "createAt" },
  { title: "Operation", dataIndex: "operation", key: "operation" },
];

const tableData = [
  {
    name: "王涛",
    phone: "",
    province: "",
    city: "",
    district: "",
    address: "",
    createAt: "",
    operation: "",
  },
];

const generateProvinceOption = () => {
  
  //<Option value="Zhejiang">Zhejiang</Option>;
  return province.map((item, index) => (
    <Option
      value={item.name}
      provincecode={item.province}
      
    >
      {item.name}
    </Option>
  ));
};

const generateCityOption = (provinceCode)=>{
    console.log(city);
    return city.filter((item,index)=>item.province === provinceCode)
    
}

console.log(generateCityOption("14")); 

const AddressPage = () => {
  const [addressInput, setAddressInput] = useState({});
  const handleInputChange = (entry, value) => {
    const newData = { ...addressInput };
    newData[entry] = value;
    setAddressInput(newData);
  };

  console.log(addressInput);

  const generateForm = () => {
    return (
      <FormWrapper>
        <h2>Add a new address</h2>
        <Form
          name="add_new_address"
          labelWrap={true}
          labelAlign="right"
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 12, offset: 1 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required." }]}
          >
            <Input
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone number is required." }]}
          >
            <Input
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Province">
            <Input.Group compact>
              <Form.Item
                name={["address", "province"]}
                noStyle
                rules={[{ required: true, message: "Province is required" }]}
              >
                <Select
                  placeholder="Select province"
                  onChange={(value,option) => {
                    handleInputChange("province", value);
                    console.log(option);
                  }}
                  //onSelect={(e)=>console.log(e)}
                >
                  {generateProvinceOption()}
                  <Option value="Zhejiang">Zhejiang</Option>
                  <Option value="Jiangsu">Jiangsu</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={["address", "street"]}
                noStyle
                rules={[{ required: true, message: "Street is required" }]}
              >
                <Input style={{ width: "50%" }} placeholder="Input street" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter the phone number." },
            ]}
          >
            <Input
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter the phone number." },
            ]}
          >
            <Input
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, message: "Please enter the phone address." },
            ]}
          >
            <Input
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter the phone number." },
            ]}
          >
            <Input
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7 }}>
            <StyledButton type="submit" htmlType="submit">
              Submit
            </StyledButton>
          </Form.Item>
        </Form>
      </FormWrapper>
    );
  };

  return (
    <Container>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Header
          title="Address"
          userName="Tuantuan"
          userImage={userImage}
          cartCount="hide"
        />
        <ContentWrapper>
          <SearchContainer>
            <StyledInput></StyledInput>
            <StyledButton type="search">Search</StyledButton>
            <StyledButton type="add" style={{ background: "#18a16d" }}>
              Add
            </StyledButton>
          </SearchContainer>
          {generateForm()}
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              tableLayout="auto"
              columns={tableColumns}
              rowKey={(record) => record._id}
              dataSource={tableData}
              bordered
            />
          </TableWrapper>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

export default AddressPage;
