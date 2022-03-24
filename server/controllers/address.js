const AddressModel = require("../models/addressModels");

const addAddress = async (req, res) => {
  try {
    await AddressModel.create(req.body);
    return res
      .status(200)
      .json({ msg: `${req.body.name}'s address has been saved successfully.` });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to add new address. Database error." });
  }
};

const getAllAddress = async (req, res) => {
  try {
    const result = await AddressModel.find();
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to initialize address. Server error." });
  }
};

module.exports = { addAddress, getAllAddress };
