const bcrypt = require("bcrypt");
const { typeToModel, generalHandle, writeLog } = require("./static");

const register = async (req, res) => {
  generalHandle(async (session) => {
    var { name, email, registerCode, password } = req.body;
    
    // Check duplication of email address in database
    const result = await typeToModel("user").findOne({
      $or: [{ name: name }, { email: email }],
    });
    if (result !== null) {
      return res.status(400).json({ msg: "User exists, please login." });
    }

    // Assign user's role according to register code
    const registerCodeToRole = {
      TUANTUAN_ADMIN: "admin",
      TUANTUAN_USER: "user",
      VISITOR: "visitor",
    };

    const role = registerCodeToRole[registerCode];
    if (role === undefined) {
      return res.status(400).json({ msg: "Register code is incorrect." });
    }

    // Save register data to database
    password = await bcrypt.hash(password, 10);
    await typeToModel("user").create([{ name, email, password, role }], {
      session: session,
    });

    // Write the log
    await writeLog(name, "Register", "", session);

    return "Your account has been registered successfully. Please login.";
  }, res);
};

module.exports = register;
