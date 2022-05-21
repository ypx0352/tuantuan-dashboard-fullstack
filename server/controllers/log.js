const { typeToModel, generalHandleWithoutTransaction } = require("./static");

const getAllLogs = (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      const rawResult = await typeToModel("log").find().sort({ createdAt: -1 });
      const result = rawResult.map((item) => {
        const { action, user, package, createdAt, ...rest } = item;
        return { action, user, package, createdAt };
      });

      return res.status(200).json({ result });
    },
    res,
    "Failed to get all logs. Server error."
  );
};

module.exports = { getAllLogs };
