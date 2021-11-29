const express = require("express");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
require("dotenv").config();

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
app.get("/:pk_id", async (req, res) => {
  const { pk_id } = req.params;
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
    console.log(response);
    res.send(cookies.toString());
  } catch (error) {
    console.log(error);
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
