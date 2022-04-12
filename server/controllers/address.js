const AddressModel = require("../models/addressModels");

const addAddress = async (req, res) => {
  generalResponse(
    async () => {
      await AddressModel.create(req.body);
      return res.status(200).json({
        msg: `${req.body.name}'s address has been saved successfully.`,
      });
    },
    res,
    500,
    "Failed to add new address. Server error."
  );
};

const getAllAddress = async (req, res) => {
  generalResponse(
    async () => {
      const result = await AddressModel.find();
      return res.status(200).json({ result });
    },
    res,
    500,
    "Failed to get all address. Server error."
  );
};

const deleteAddress = async (req, res) => {
  generalResponse(
    async () => {
      await AddressModel.findByIdAndRemove(req.body._id);
      return res
        .status(200)
        .json({ msg: "Address has been deleted successfully." });
    },
    res,
    500,
    "Failed to delete this address. Server error."
  );
};

const updateAddress = async (req, res) => {
  generalResponse(
    async () => {
      const { name, phone, province, city, district, address, note, _id } =
        req.body;
      await AddressModel.findByIdAndUpdate(_id, {
        $set: { name, phone, province, city, district, address, note },
      });
      return res.status(200).json({
        msg: `${name}'s address has been updated successfully.`,
      });
    },
    res,
    500,
    "Failed to update this address. Server error."
  );
};

const generalResponse = (action, res, errorCode, errorMsg) => {
  try {
    action();
  } catch {
    console.log(error);
    res.status(errorCode).json({ msg: errorMsg });
  }
};

module.exports = { addAddress, getAllAddress, deleteAddress, updateAddress };
