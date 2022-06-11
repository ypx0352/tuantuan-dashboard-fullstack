const bcrypt = require("bcrypt");
const path = require("path");
const { typeToModel, generalHandle, writeLog, sendEmail } = require("./static");

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

    // Send verification email.
    const emailContent = `<div
        style="
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
      >
        <div
          style="
          display: flex;
          flex-direction: column;
          
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          width: 100%;
          height: 200px;
          background-color: antiquewhite;
        "
        >
          <h2>Hi ${name},</h2>
          <p style="padding: 0 50px;">
            Please click the following URL to verify your email.
          </p>
          <a>${process.env.SERVER_BASE_URL}/api/register/verify_email?username=${name}</a>
        </div>
      </div>`;
    await sendEmail(email, "Email verification", emailContent);

    // Write the log
    await writeLog(name, "Register", "", session);

    return "Your account has been registered successfully. Please login.";
  }, res);
};

const verifyEmail = async (req, res) => {
  try {
    // Verify the email's existence.
    const { username } = req.query;
    const emailRecord = await typeToModel("user").findOne({ name: username });
    if (emailRecord === null) {
      return res
        .status(400)
        .sendFile(
          path.resolve(
            __dirname,
            "../public/html/emailVerificationUserNotExist.html"
          )
        );
    }

    await typeToModel("user").findOneAndUpdate(
      { name: username },
      { $set: { emailVerified: true } }
    );
    return res
      .status(200)
      .sendFile(
        path.resolve(__dirname, "../public/html/emailVerificationSuccess.html")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .sendFile(
        path.resolve(__dirname, "../public/html/emailVerificationError.html")
      );
  }
};

module.exports = { register, verifyEmail };
