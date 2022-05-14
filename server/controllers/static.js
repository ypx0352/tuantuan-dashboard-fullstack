const LogModel = require("../models/logModel");

const writeLog = async (user, action, pk_id, session) => {
  const result = await LogModel.insertMany(
    [
      {
        user: user,
        action: action,
        package: pk_id,
      },
    ],
    { session: session, rawResult: true }
  );
  return result;
};

module.exports = { writeLog };
