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

const deleteAddress = async (req, res) => {
  try {
    const { _id } = req.body;
    await AddressModel.findByIdAndRemove(_id);
    return res
      .status(200)
      .json({ msg: "This address has been deleted successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Failed to delete this address. Server error." });
  }
};

const updateAddress = async (req, res) => {
  const { name, phone, province, city, district, address, note, _id } =
    req.body;

  try {
    const result = await AddressModel.findByIdAndUpdate(_id, {
      $set: { name, phone, province, city, district, address, note },
    });
    console.log(result);
    return res.status(200).json({
      msg: `${name}'s address has been updated successfully.`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: "Failed to update this address. Server error" });
  }
};

module.exports = { addAddress, getAllAddress, deleteAddress, updateAddress };