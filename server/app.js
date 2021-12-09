const express = require("express");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
require("dotenv").config();
const cheerio = require("cheerio");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
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
//login();

// search for a specific package
const getOnePackage = async (pk_id) => {
  console.log("check package.");
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
    // check response contain package information
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

app.get("/:pk_id", async (req, res) => {
  const { pk_id } = req.params;
  var result = await getOnePackage(pk_id);
  for (let index = 0; index <= 3; index++) {
    if (result != "false") {
      res.status(200).json(result);
      break;
    } else {
      if (index !== 3) {
        await login();
        result = await getOnePackage(pk_id);
      } else {
        res.send("server error");
      }
    }
  }
});

// search for all packages
app.get("/api/all", async (req, res) => {
  const packageResponse = await axios.get(
    "https://www.polarexpress.com.au/poladmin/package",
    {
      headers: { Cookie: cookies.toString() },
    }
  );
  console.log(packageResponse);
  res.send("1");
});

app.listen(1100, () => {
  console.log("server listening on port 1100.");
});

//parse html

const data = fs.readFileSync("../client/src/test.html", "utf8");

const parseHtml = (data) => {
  const package_msg = {};
  const $ = cheerio.load(data);
  // package_id
  package_msg.package_id = $(".wid20").children().text();

  // weight
  package_msg.package_weight = $("thead")
    .children()
    .children()
    .eq(4)
    .text()
    .replace("KGs", "");

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
  package_msg.item_count = $("tbody")
    .children()
    .children()
    .eq(3)
    .children()
    .eq(0)
    .html()
    .split("：")[1];

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
    items[index] = $(element).text().replace(";",'');
  });
  package_msg.items = items;
  return package_msg;
};

//console.log(parseHtml(data));
