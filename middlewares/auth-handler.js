import jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/unauthorized.js";

const authHandler = (req, res, next) => {
  let { token } = req.cookies;
  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader?.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.MY_JWT_SECRET);
      console.log(decoded)
      req.user = decoded;
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  } else {
    throw new UnauthorizedError("No token provided");
  }
  next();
};

export default authHandler;
