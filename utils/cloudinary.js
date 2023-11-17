const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dg7zsjimc",
  api_key: "167368724887498",
  api_secret: "bxvgQdrWEVAF57U2pn4MW1Xho2A",
});

module.exports = cloudinary;
