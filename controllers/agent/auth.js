const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../../models/Agent");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const {
  sendEmail,
  verifyEmailMessage,
  resetPasswordMessage,
} = require("../../utils/email");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

// Register
const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Password Mismatch."));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const agent = await Agent.create({ ...req.body, password: hashedPassword });
  const verificationToken = jwt.sign(
    { userId: agent._id, email: agent.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  await sendEmail({
    email: agent.email,
    subject: "VERIFY YOUR EMAIL - CIMA APP",
    message: verifyEmailMessage(verificationToken, "agent", agent.fullName),
  });
  res.status(StatusCodes.CREATED).json(
    createResponseData(
      {
        name: agent.fullName,
        verificationToken: verificationToken,
      },
      false,
      "User is Created Successfully."
    )
  );
});

// Verify Email
const verifyEmail = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Token."));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decodedToken;
  const agent = await Agent.findOne({ _id: userId });
  if (!agent) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Registration Token"));
  }
  if (agent.isEmailVerified === true) {
    return res
      .status(StatusCodes.OK)
      .json(
        createResponseData(null, false, `${agent.email} is Already Verified.`)
      );
  }
  agent.isEmailVerified = true;
  await agent.save();
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Email is now Verified."));
});

// Login
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, "Please provide email and password.")
      );
  }
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createResponseData(null, true, "User does not Exist."));
  }
  const passwordMatch = await bcrypt.compare(password, agent.password);
  if (!passwordMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Incorrect Password."));
  }
  if (agent.isEmailVerified === false) {
    const verificationToken = jwt.sign(
      { userId: agent._id, email: agent.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
    await sendEmail({
      email: agent.email,
      subject: "VERIFY YOUR EMAIL - CIMA APP",
      message: verifyEmailMessage(verificationToken, "agent", agent.fullName),
    });
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        createResponseData(
          null,
          true,
          "A verification link has been sent. Please Verify Email Before Login."
        )
      );
  }
  const token = jwt.sign(
    { userId: agent._id, name: agent.fullName, email: agent.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  res
    .status(StatusCodes.OK)
    .json(createResponseData({ token }, false, "Login is Successful."));
});

// Forgot password
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, true, "Please Provide Email."));
  }
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "User does not exit."));
  }
  const resetPasswordToken = jwt.sign(
    { userId: agent._id, email: email },
    process.env.JWT_SECRET
  );
  await sendEmail({
    email: agent.email,
    subject: "CIMA- RESET PASSWORD",
    message: resetPasswordMessage(resetPasswordToken, "agent"),
  });
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        { resetPasswordToken },
        false,
        "Reset password email sent"
      )
    );
});

// Reset password
const resetPassword = asyncWrapper(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Password Mismatch."));
  } else if (!newPassword || !confirmPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(
          null,
          true,
          "Please Provide Password or Confirm Password"
        )
      );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const { token } = req.query;
  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Token."));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, email } = decodedToken;
  const agent = await Agent.findOne({ email: email });
  if (!agent) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "User not Found."));
  }
  agent.password = hashedPassword;
  await agent.save();
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Password is Successfully Updated."));
});

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
