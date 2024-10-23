import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename =
      Date.now() + "-" + Math.random() * 1e9 + "-" + file.originalname;
    cb(null, filename);
  },
});

export default storage;
