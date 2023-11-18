const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    // Define how the files should be named
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
