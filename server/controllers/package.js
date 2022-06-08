const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  trackParcel,
  getOrderModels,
  generalHandleWithoutTransaction,
  typeToModel,
  login,
} = require("./static");
const PackageModel = require("../models/packageModel");
let mtoken = "";

const getSearchedPackage = (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      const { pk_id } = req.query;
      const trackRecords = await trackParcel(pk_id, "sendTimeAndTrack");

      // Get items not yet paid (items in Sold, Stock, Employee, Exception collections)
      var itemRecords = [];
      for (const model of getOrderModels()) {
        const result = await model.find({ pk_id: pk_id });
        result.forEach((item) => itemRecords.push(item));
        //itemRecords.concat(result); //TODO: delete this row
      }

      //Get paid items (items in the Transaction collection)
      const transactionResult = await typeToModel("transaction").find({
        "items.pk_id": pk_id,
      });

      transactionResult.forEach((transaction) => {
        var transactionObj = transaction.toObject();
        const approved = transactionObj.approved;
        const transaction_id = transactionObj._id;
        transactionObj.items.forEach((item) => {
          if (item.pk_id === pk_id) {
            // Add transaction_id, transactionApproved and type property in transaction items
            item.transaction_id = transaction_id;
            item.type = item.originalType;
            item.transactionApproved = approved;
            itemRecords.push(item);
          }
        });
      });

      const packageRecord = await PackageModel.findOne({ pk_id: pk_id });

      if (packageRecord === null && itemRecords.length === 0) {
        return res.status(400).json({
          msg: "Can not find this package in the database. Check your input.",
        });
      }
      res.status(200).json({ itemRecords, packageRecord, trackRecords });
    },
    res,
    "Failed to search this package. Server error."
  );
};

const getLatestPackages = (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      const { limit } = req.query;
      const rawResult = await PackageModel.find()
        .sort("-createdAt")
        .limit(Number(limit));
      const result = rawResult.map((item) => {
        const { pk_id, type, receiver, sendTimeISO, ...rest } = item;
        const sendLocaleDate = new Date(sendTimeISO)
          .toLocaleDateString()
          .slice(0, 5);
        return { pk_id, type, receiver, sendLocaleDate };
      });
      res.status(200).json({ result });
    },
    res,
    "Failed to get the latest packages. Server error."
  );
};

const getPostSlip = async (req, res) => {
  const { pk_id } = req.query;
  const slicedPk_id = pk_id.slice(2, -2);
  console.log(slicedPk_id);
  const testToken = async () => {
    const pdf = await axios.get(
      `${process.env.PLOAR_POST_SLIP_BASE_URL}?pkg_id=${slicedPk_id}&mtoken=${mtoken}`,
      { responseType: "blob", encoding: null }
    );
    console.log(
      `${process.env.PLOAR_POST_SLIP_BASE_URL}?pkg_id=${slicedPk_id}&mtoken=${mtoken}`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=pdf");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader(
      "Cache-Control",
      "private,must-revalidate,post-check=0,pre-check=0,max-age=1"
    );
    res.setHeader("Transfer-Encoding", "chunked");

    return res.status(200).json({ result: pdf.data });
  };

  const testToken2 = async () => {
    console.log(path.resolve(__dirname, "../public/pdf/EAW4-task2.pdf"));
    var file = fs.createReadStream(
      "/Users/patrick/Documents/vsCode Projects/tuantuan-dashboard-fullstack/server/public/pdf/EAW4-task2.pdf"
    );
    var stat = fs.statSync(
      "/Users/patrick/Documents/vsCode Projects/tuantuan-dashboard-fullstack/server/public/pdf/EAW4-task2.pdf"
    );
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=quote.pdf");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader(
      "Cache-Control",
      "private,must-revalidate,post-check=0,pre-check=0,max-age=1"
    );
    res.setHeader("Transfer-Encoding", "chunked");
    file.pipe(res);
  };

  if (mtoken !== "") {
    //testToken();
    testToken2();
  } else {
    mtoken = await login();
    testToken2();
  }
};

module.exports = { getSearchedPackage, getLatestPackages, getPostSlip };
