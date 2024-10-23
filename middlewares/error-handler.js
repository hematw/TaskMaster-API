import mongoose from "mongoose";
import NotFoundError from "../errors/not-found.js";

const errorHandler = (err, req, res, next) => {
  // console.log(err);
  // Handle mongoDB duplicate error
  if (err.code || err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: `Account exists with ${err.keyValue.email}`,
    });
  }
  if (err.name === "ValidationError") {
    let errMsg = Object.values(err.errors)
      .map((e) => e.message)
      .join(" & ");

    return res.status(400).json({ success: false, message: errMsg });
  }
  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      msg: `No item found with id ${err.value}`,
    });
  }
  res.status(err.status || 500).json({ success: false, message: err.message });
};

export default errorHandler;
