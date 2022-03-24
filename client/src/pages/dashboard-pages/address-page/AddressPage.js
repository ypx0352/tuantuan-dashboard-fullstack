import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Table, Input, Button, Form, Select, Spin } from "antd";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import userImage from "../../../image/tuan-logo.jpeg";
import { data, province, city, area } from "province-city-china/data";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";
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

const colors = {
  search: "#3751ff",
  add: "#18a16d",
  submit: "#145DA0",
  reset: "#DF362D",
  cancel: "#189AB4",
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

const FormWrapper = styled.div`
  &.hide {
    display: none;
  }
`;

const tableColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Province", dataIndex: "province", key: "province" },
  { title: "City", dataIndex: "city", key: "city" },
  { title: "District", dataIndex: "district", key: "district" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Created at", dataIndex: "createdAtLocale", key: "createAt" },
  { title: "Operation", dataIndex: "operation", key: "operation" },
];

const generateOption = (provinceCode, cityCode) => {
  if (provinceCode === undefined) {
    return province.map((item, index) => (
      <Option value={item.name} provincecode={item.province}>
        {item.name}
      </Option>
    ));
  } else {
    if (cityCode === undefined) {
      switch (provinceCode) {
        case "11":
          return (
            <Option value="北京市" citycode={0}>
              北京市
            </Option>
          );
        case "12":
          return (
            <Option value="天津市" citycode={0}>
              天津市
            </Option>
          );
        case "31":
          return (
            <Option value="上海市" citycode={0}>
              上海市
            </Option>
          );
        case "50":
          return (
            <Option value="重庆市" citycode={0}>
              重庆市
            </Option>
          );
        default:
          const cityPatten = new RegExp(`${provinceCode}[0-9][0-9]00`);
          return city
            .filter((item) => cityPatten.exec(item.code))
            .map((item) => (
              <Option value={item.name} citycode={item.city}>
                {item.name}
              </Option>
            ));
      }
    } else {
      const districtPatten =
        cityCode === 0
          ? new RegExp(`${provinceCode}01[0-9][0-9]`)
          : new RegExp(`${provinceCode}${cityCode}[0-9][0-9]`);

      return area
        .filter((item) => districtPatten.exec(item.code))
        .map((item) => (
          <Option value={item.name} areacode={item.area}>
            {item.name}
          </Option>
        ));
    }
  }
};

console.log(generateOption());
const AddressPage = (props) => {
  const {
    submitNewAddress,
    onCancel,
    addFormDisplayed,
    displayAddForm,
    initializeAddress,
    allAddress,
    tableSpinning,
  } = props;

  const [addressInput, setAddressInput] = useState({
    province: "",
    city: "",
    district: "",
  });

  const [optionCode, setOptionCode] = useState({});

  const [provinceCode, setProvinceCode] = useState("");

  const [cityCode, setCityCode] = useState("");

  const [form] = Form.useForm();

  const [tableData, setTableData] = useState();

  useEffect(() => {
    initializeAddress();
  }, []);

  useEffect(() => {
    setTableData(allAddress.toJS());
  }, [allAddress]);

  const handleInputChange = (entry, value) => {
    switch (entry) {
      case "province":
        setAddressInput({
          ...addressInput,
          province: value,
          city: "",
          district: "",
        });
        break;
      case "city":
        setAddressInput({
          ...addressInput,
          province: addressInput.province,
          city: value,
          district: "",
        });
        break;
      case "district":
        setAddressInput({
          ...addressInput,
          province: addressInput.province,
          city: addressInput.city,
          district: value,
        });
      default:
        const newData = { ...addressInput };
        newData[entry] = value;
        setAddressInput(newData);
    }
  };

  const onReset = () => {
    form.resetFields();
    setAddressInput({
      province: "",
      city: "",
      district: "",
    });
  };

  const generateForm = () => {
    const value = "111";
    return (
      <Form
        form={form}
        name="add_new_address"
        labelWrap={false}
        labelAlign="right"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12, offset: 1 }}
        onFinish={() => submitNewAddress(addressInput)}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required." }]}
        >
          <Input onChange={(e) => handleInputChange("name", e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone number is required." }]}
        >
          <Input onChange={(e) => handleInputChange("phone", e.target.value)} />
        </Form.Item>

        <Form.Item label="Area" name="area" wrapperCol={{ offset: 1 }}>
          <h3>{`${addressInput.province} ${addressInput.city} ${addressInput.district} `}</h3>
          <Input.Group compact>
            <Form.Item
              name="province"
              noStyle
              rules={[{ required: true, message: "Province is required" }]}
            >
              <Select
                placeholder="Province"
                onChange={(value, option) => {
                  handleInputChange("province", value);
                  setOptionCode({
                    provinceCode: option.provincecode,
                  });
                }}
                showSearch
                style={{ width: "23%" }}
              >
                {generateOption()}
              </Select>
            </Form.Item>
            <Form.Item
              name="city"
              noStyle
              rules={[{ required: true, message: "City is required" }]}
            >
              <Select
                placeholder="City"
                disabled={optionCode.provinceCode === undefined ? true : false}
                onChange={(value, option) => {
                  handleInputChange("city", value);
                  setOptionCode({
                    ...optionCode,
                    cityCode: option.citycode,
                  });
                }}
                showSearch
                style={{ width: "23%" }}
                defaultOpen={true}
              >
                {generateOption(optionCode.provinceCode)}
              </Select>
            </Form.Item>
            <Form.Item
              name="district"
              noStyle
              rules={[{ required: true, message: "District is required" }]}
            >
              <Select
                placeholder="District"
                onChange={(value) => {
                  handleInputChange("district", value);
                }}
                disabled={
                  optionCode.provinceCode === undefined ||
                  optionCode.cityCode === undefined
                    ? true
                    : false
                }
                showSearch
                style={{ width: "25%" }}
              >
                {generateOption(optionCode.provinceCode, optionCode.cityCode)}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Address is required." }]}
        >
          <Input
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Note" name="note">
          <Input onChange={(e) => handleInputChange("note", e.target.value)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10 }}>
          <StyledButton type="submit" htmlType="submit">
            Submit
          </StyledButton>
          <StyledButton type="reset" htmlType="button" onClick={onReset}>
            Reset
          </StyledButton>
          <StyledButton type="cancel" htmlType="button" onClick={onCancel}>
            Cancel
          </StyledButton>
        </Form.Item>
      </Form>
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
            <StyledButton
              type="add"
              style={{ background: "#18a16d" }}
              onClick={displayAddForm}
            >
              Add
            </StyledButton>
          </SearchContainer>
          <FormWrapper className={addFormDisplayed ? "" : "hide"}>
            {generateForm()}
          </FormWrapper>
          <Spin spinning={tableSpinning} tip="Loading...">
            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={tableColumns}
                rowKey={(record) => record._id}
                dataSource={tableData}
                bordered
                spin={true}
              />
            </TableWrapper>
          </Spin>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  addFormDisplayed: state.getIn(["address", "addFormDisplayed"]),
  allAddress: state.getIn(["address", "allAddress"]),
  tableSpinning: state.getIn(["address", "tableSpinning"]),
});

const mapDispatch = (dispatch) => ({
  initializeAddress() {
    dispatch(actionCreators.initializeAddressAction);
  },

  submitNewAddress(address) {
    dispatch(actionCreators.submitNewAddressAction(address));
  },

  onCancel() {
    dispatch({ type: actionTypes.SHOW_ADD_FORM, value: fromJS(false) });
  },

  displayAddForm() {
    dispatch({ type: actionTypes.SHOW_ADD_FORM, value: fromJS(true) });
  },
});

export default connect(mapState, mapDispatch)(AddressPage);
