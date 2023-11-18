const multer = require("multer");

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   // Your destination folder for storing uploads
  //   cb(null, "uploads/");
  // },
  filename: function (req, file, cb) {
    // Define how the files should be named
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
