const {
  trackParcel,
  getOrderModels,
  generalHandleWithoutTransaction,
} = require("./static");
const PackageModel = require("../models/packageModel");

const getSearchedPackage = (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      const { pk_id } = req.query;
      const trackRecords = await trackParcel(pk_id, "sendTimeAndTrack");
      var itemRecords = [];
      for (const model of getOrderModels()) {
        const result = await model.find({ pk_id: pk_id });
        result.forEach((item) => itemRecords.push(item));
        itemRecords.concat(result);
      }

      const packageRecord = await PackageModel.findOne({ pk_id: pk_id });

      if (packageRecord === null || itemRecords.length === 0) {
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

module.exports = { getSearchedPackage, getLatestPackages };
