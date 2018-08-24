const path = require("path");

function dir(...filePaths) {
  return path.join(__dirname, "..", ...filePaths);
}

exports.dir = dir;
