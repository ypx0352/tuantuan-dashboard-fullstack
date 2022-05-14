const LogModel = require("../models/logModel");

const getAllLogs = async (req, res) => {
  generalResponse(
    async () => {
      const rawResult = await LogModel.find({ sort: { createdAt: -1 } });
      const result = rawResult.map((item) => {
        const { action, user, package, createdAt, ...rest } = item;
        return { action, user, package, createdAt };
      });

      return res.status(200).json({ result });
    },
    res,
    500,
    "Failed to get all logs. Server error."
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

module.exports = { getAllLogs };
