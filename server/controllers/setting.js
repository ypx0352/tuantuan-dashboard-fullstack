const {generalHandleWithoutTransaction} = require('./static')
const SettingModel = require("../models/settingModels");

// Some parameter that should be stored in setting file
const normalPostage = 7.4;
const babyFormulaPostage = 18.9;
const exchangeRateInSetting = 4.7;

const getSetting = async (req, res) => {
  generalHandleWithoutTransaction(
    async () => {const result = await SettingModel.find();
    return res.status(200).json({ result: result });},
    res,
    "Failed to get settings. Server error"
  );
  // try {
  //   const result = await SettingModel.find();
  //   return res.status(200).json({ result: result });
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json({ msg: "Failed to get settings. Server error" });
  // }
};

const setSetting = async (req, res) => {
  const { name, value } = req.body;
  console.log(name, value);
  try {
    await SettingModel.findOneAndUpdate(
      { name: name },
      { $set: { value: value } }
    );
    return res.status(200).json({ msg: "Updated successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Failed to update setting. Server error." });
  }
};

module.exports = { getSetting, setSetting };
