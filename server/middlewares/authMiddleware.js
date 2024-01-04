import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: {
          code: "401",
          message: "UnAuthorized. Forbidden Request",
        },
        data: null,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: {
        code: "401",
        message: "UnAuthorized. Forbidden Request. Token Missing.",
      },
      data: null,
    });
  }
};

export { protect };
