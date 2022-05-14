const LogModel = require("../models/logModel");
const connection = require("../database");

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

const generalHandle = async (action, res) => {
  const session = await connection.startSession();
  try {
    session.startTransaction();

    const successResponseText = await action(session);
    await session.commitTransaction();
    res.status(200).json({ msg: successResponseText });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({
      msg: error.message || "Server error!",
    });
  }
  session.endSession();
};

module.exports = { writeLog,generalHandle };
