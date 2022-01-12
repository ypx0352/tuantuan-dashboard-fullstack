const express = require("express");
const cors = require("cors");
require("dotenv").config();
const orderRouter = require("./routers/order");
const checkoutRouter = require("./routers/checkout");

const app = express();
app.use(express.json());
app.use(cors());

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

app.use("/api/order", orderRouter);

app.use("/api/checkout", checkoutRouter);

app.listen(1100, () => {
  console.log("server listening on port 1100.");
});
