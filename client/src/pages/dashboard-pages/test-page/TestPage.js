import React, { useState } from "react";
import { Table, Input, Button } from "antd";

const TestPage = () => {
  const packageWeight = 5;

  const itemData = [
    {
      item: "1",
      qty: 5,
      price: 0,
      weight: 0,
      stock: 0,
      employee: 0,
      note: "something important",
      subtotalWeight: 0,
    },
    {
      item: "1",
      qty: 2,
      price: 0,
      weight: 0,
      stock: 1,
      employee: 1,
      note: "something important",
      subtotalWeight: 0,
    },
    {
      item: "1",
      qty: 2,
      price: 0,
      weight: 0,
      stock: 1,
      employee: 1,
      note: "something important",
      subtotalWeight: 0,
    },
  ];

  const [itemTableData, setItemTableData] = useState(itemData);
  const [totalWeight, setTotalWeight] = useState(0);

  const setEachWeight = (data, index) => {
    data[index]["weight"] = data[index]["subtotalWeight"] / data[index]["qty"];
  };

  const addWeight = (data) => {
    var newTotalWeight = 0;
    data.map((item) => {
      newTotalWeight += item["subtotalWeight"];
    });
    setTotalWeight(newTotalWeight);
  };

  const onInputChange = (key, index) => (e) => {
    const newData = [...itemTableData];
    if (key === "item" || key === "note") {
      newData[index][key] = e.target.value;
    } else {
      newData[index][key] = Number(e.target.value);
    }
    setEachWeight(newData, index);
    addWeight(newData);
    setItemTableData(newData);
    console.log(totalWeight);
  };

  const itemColumns = [
    {
      title: "Item Information",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
          render: (text, record, index) => {
            return (
              <Input
                type="text"
                value={text}
                bordered={false}
                onChange={onInputChange("item", index)}
              />
            );
          },
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                bordered={false}
                value={text}
                onChange={onInputChange("qty", index)}
              />
            );
          },
        },
        {
          title: "Price / each",
          dataIndex: "price",
          key: "price",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                prefix="$"
                value={text}
                bordered={false}
                onChange={onInputChange("price", index)}
              />
            );
          },
        },
        {
          title: "Weight / each",
          dataIndex: "weight",
          key: "weight",
        },
        {
          title: "Add to stock",
          dataIndex: "stock",
          key: "stock",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                min={0}
                max={
                  itemTableData[index]["qty"] - itemTableData[index]["employee"]
                }
                value={text}
                bordered={false}
                onChange={onInputChange("stock", index)}
              />
            );
          },
        },
        {
          title: "Emplyee purchase",
          dataIndex: "employee",
          key: "employee",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                min={0}
                max={
                  itemTableData[index]["qty"] - itemTableData[index]["stock"]
                }
                bordered={false}
                value={text}
                onChange={onInputChange("employee", index)}
              />
            );
          },
        },
        {
          title: "Note",
          dataIndex: "note",
          key: "note",
          render: (text, record, index) => {
            return (
              <Input
                type="text"
                value={text}
                bordered={false}
                onChange={onInputChange("note", index)}
              />
            );
          },
        },
        {
          title: "Subtotal weight",
          dataIndex: "subtotalWeight",
          key: "subtotalWeight",
          render: (text, record, index) => {
            const handleAutoFill = (index) => {
              const newData = [...itemTableData];
              newData[index]["subtotalWeight"] =
                packageWeight - totalWeight - newData[index]["subtotalWeight"] <
                0
                  ? 0
                  : packageWeight -
                    totalWeight -
                    newData[index]["subtotalWeight"];
              setEachWeight(newData, index);
              addWeight(newData);
              setItemTableData(newData);
              console.log(totalWeight);
            };
            return (
              <>
                <Input
                  type="number"
                  min={0}
                  max={packageWeight}
                  value={text}
                  bordered={false}
                  onChange={onInputChange("subtotalWeight", index)}
                />
                <Button onClick={() => handleAutoFill(index)}>Auto Fill</Button>
              </>
            );
          },
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          render: (text, record, index) => {
            const handleRowConfirm = () => {
              console.log(itemTableData);
            };
            return <Button onClick={handleRowConfirm}>Confirm</Button>;
          },
        },
      ],
    },
  ];

  return (
    <Table
      style={{ width: "70%" }}
      columns={itemColumns}
      dataSource={itemTableData}
      pagination={{ position: ["none", "none"] }}
      bordered
    />
  );
};

export default TestPage;
