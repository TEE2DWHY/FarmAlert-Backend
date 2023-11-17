const { StatusCodes } = require("http-status-codes");

const authorization = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized User.",
    });
  }
  const token = authToken.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid Token",
    });
  }
  const { id } = user;
  id = req.user.id;
};

module.exports = authorization;
