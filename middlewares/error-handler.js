import mongoose from "mongoose";
import NotFoundError from "../errors/not-found.js";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  // Handle mongoDB duplicate error
  if (err.code || err.code === 11000) {
    return res.status(409).json({
      message: `Account exists with ${err.keyValue.email}`,
    });
  }
  if (err.name === "ValidationError") {
    let errMsg = Object.values(err.errors)
      .map((e) => e.message)
      .join(" & ");

    return res.status(400).json({ message: errMsg });
  }
  if (err.name === "CastError") {
    return res.status(404).json({
      message: `No item found with id ${err.value}, or id is invalid`,
    });
  }
  res.status(err.status || 500).json({ message: err.message });
};

export default errorHandler;
