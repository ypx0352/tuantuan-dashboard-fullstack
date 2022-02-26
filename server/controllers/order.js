const cheerio = require("cheerio");
const FormData = require("form-data");
const axios = require("axios");
const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
} = require("../models/orderModels");

var cookies = [];
// login the account of the post office and get cookies
const login = async () => {
  var bodyFormData = new FormData();
  bodyFormData.append(
    "refer",
    "https%253A%252F%252Fwww.polarexpress.com.au%252Fmember"
  );
  bodyFormData.append("member_email", process.env.EMAIL);
  bodyFormData.append("member_passwd", process.env.PASSWORD);
  try {
    const response = await axios({
      method: "post",
      url: "https://www.polarexpress.com.au/ajax_common/login_check",
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
    });
    cookies = response.headers["set-cookie"];
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

// search for a specific package
const getOnePackage = async (pk_id) => {
  console.log("check one package.");
  var packageSearchData = new FormData();
  packageSearchData.append("msearch_text", "idnum");
  packageSearchData.append("sm_search", "1");
  packageSearchData.append("msearch_keyword", pk_id);
  try {
    const response = await axios({
      method: "post",
      url: "https://www.polarexpress.com.au/poladmin/package",
      data: packageSearchData,
      headers: packageSearchData.getHeaders({ cookie: cookies.toString() }),
    });
    // check if the response is correct
    const $ = cheerio.load(response.data);
    if ($(".wid20").children().text().trim() === pk_id.trim()) {
      return parseHtml(response.data);
    } else {
      return "false";
    }
  } catch (error) {
    console.log(error);
    return "false";
  }
};

//parse html
const parseHtml = (data) => {
  const package_msg = {};
  const $ = cheerio.load(data);
  // package_id
  package_msg.package_id = $(".wid20").children().text();

  // weight
  package_msg.package_weight = parseFloat(
    $("thead").children().children().eq(4).text().replace("KGs", "").trim()
  );

  // receiver name and phone
  const nameAndPhone = $("tbody")
    .children()
    .children()
    .eq(1)
    .children()
    .eq(1)
    .text()
    .trim()
    .replace("：", "")
    .split("/");
  package_msg.receiver_name = nameAndPhone[0].trim();
  package_msg.receiver_phone = nameAndPhone[1].trim();

  // reveiver address
  package_msg.receiver_address = $("tbody")
    .children()
    .children()
    .eq(1)
    .children()
    .eq(2)
    .text();

  // amount
  package_msg.item_count = parseInt(
    $("tbody")
      .children()
      .children()
      .eq(3)
      .children()
      .eq(0)
      .html()
      .split("：")[1]
  );

  // type
  package_msg.item_type = $("tbody")
    .children()
    .children()
    .eq(3)
    .children()
    .eq(1)
    .html()
    .split("：")[1];

  // items
  var items = [];
  $(".cp_title").each((index, element) => {
    items[index] = $(element).text().replace(";", "");
  });
  package_msg.items = items;
  return package_msg;
};

const getOrder = async (req, res) => {
  const { pk_id } = req.params;
  var result = await getOnePackage(pk_id);
  // try to relogin when cookies expire
  for (let index = 0; index <= 3; index++) {
    if (result != "false") {
      res.status(200).json({ result: result });
      break;
    } else {
      if (index !== 3) {
        await login();
        result = await getOnePackage(pk_id);
      } else {
        res
          .status(400)
          .json({ msg: "Can not find the package, please check your input!" });
      }
    }
  }
};

const getExchangeRate = async (req, res) => {
  try {
    // request html from the bank
    const response = await axios.get("https://www.boc.cn/sourcedb/whpj/");

    // parse html
    const $ = cheerio.load(response.data);
    const exchangeRate = $("tr").eq(3).children().eq(3).text();
    res.status(200).json({ result: exchangeRate });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Can not get the exchange rate!" });
  }
};

const submitOrder = async (req, res) => {
  const dataTime = new Date().toLocaleString();
  const tableData = req.body;
  const { id, exchangeRate } = tableData.package;
  try {
    const items = [[], [], []];
    tableData.items.forEach((element) => {
      const { qty, stock, employee } = element;
      const sold = qty - stock - employee;
      const counts = [sold, stock, employee];
      const types = ["sold", "stock", "employee"];

      const firstLetterToUpperCase = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      };

      for (let index = 0; index < counts.length; index++) {
        const count = counts[index];
        if (count > 0) {
          items[index].push({
            ...element,
            qty: count,
            pk_id: id,
            exchangeRate: exchangeRate,
            type: types[index],
            status: "Order placed",
            log: `*[${dataTime} ${firstLetterToUpperCase(
              types[index]
            )} + ${count} <= Order]* `,
          });
        }
      }
    });

    const [soldItems, stockItems, employeeItems] = items;

    res.status(200).json({
      pk_id: id,
      sold: soldItems,
      stock: stockItems,
      employee: employeeItems,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Fail to submit table data!" });
  }
};

const confirmOrder = async (req, res) => {
  const { pk_id, stock, employee, sold } = req.body;

  // To avoid duplicate saves, check duplicates first.
  const models = [SoldItemsModel, StockItemsModel, EmployeeItemsModel];

  for (const model of models) {
    const result = await model.findOne({ pk_id });
    if (result !== null) {
      return res.status(400).json({
        msg: "Failed! This package has already been saved! ",
      });
    }
  }

  // Insert data to three data collections

  const itemsCollections = [sold, stock, employee];
  const types = ["Sold", "Stock ", "employee"];
  for (let index = 0; index < itemsCollections.length; index++) {
    const itemCollection = itemsCollections[index];
    if (itemCollection.length > 0) {
      try {
        await models[index].insertMany(
          itemCollection.map((item) => {
            delete item.key;
            return item;
          })
        );
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ msg: `Failed to save ${types[index]} items.` });
      }
    }
  }

  res.status(200).json({ msg: "Data saved to database successfully!" });
};

module.exports = { getOrder, getExchangeRate, submitOrder, confirmOrder };
