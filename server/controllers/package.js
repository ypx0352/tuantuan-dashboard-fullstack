const axios = require("axios");
const cheerio = require("cheerio");

const {
  SoldItemsModel,
  StockItemsModel,
  EmployeeItemsModel,
  ExceptionItemModel,
} = require("../models/orderModels");

const PackageModel = require("../models/packageModel");

const parseTrackHtml = async (data) => {
  const trackInfo = [];
  const $ = cheerio.load(data);
  $(".weui_media_text").each((index, element) => {
    const time = $(element).children().eq(0).text();
    const message = $(element).children().eq(1).children().eq(1).text();
    trackInfo.push({ time, message });
  });

  return trackInfo;
};

const getSearchedPackage = async (req, res) => {
  const { pk_id } = req.query;
  try {
    const url = `https://www.polarexpress.com.au/wechat/track/?s=${pk_id}`;
    const response = await axios.get(url);
    const trackRecords = await parseTrackHtml(response.data);

    const recordInSold = await SoldItemsModel.find({ pk_id: pk_id });
    const recordInStock = await StockItemsModel.find({ pk_id: pk_id });
    const recordInEmployee = await EmployeeItemsModel.find({ pk_id: pk_id });
    const recordInException = await ExceptionItemModel.find({
      pk_id: pk_id,
    });
    const itemRecords = recordInSold.concat(
      recordInStock,
      recordInEmployee,
      recordInException
    );
    if (itemRecords?.length === 0) {
      return res
        .status(400)
        .json({ msg: "Can not find this package in the database." });
    }

    const packageRecord = await PackageModel.findOne({ id: pk_id });

    if (packageRecord === null) {
      return res
        .status(400)
        .json({ msg: "Can not find this package in the database." });
    }

    res.status(200).json({ itemRecords, packageRecord, trackRecords });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to fetch this package. Server error." });
  }
};

const getLatestPackages = async (req, res) => {
  const { limit } = req.query;
  try {
    const rawResult = await PackageModel.find()
      .sort("-createdAt")
      .limit(Number(limit));
    const result = rawResult.map((item) => {
      const { id, type, receiver, ...rest } = item;
      return { id, type, receiver };
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to get the latest packages. Server error." });
  }
};

module.exports = { getSearchedPackage, getLatestPackages };
