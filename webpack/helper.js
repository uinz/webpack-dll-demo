const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

function checkDll() {
  if (
    !fs.existsSync(dir("dll", "manifest.json")) ||
    !fs.existsSync(dir("dll", "vendor.dll.js"))
  ) {
    console.log("build dll...");
    execSync("yarn dll");
    console.clear();
  }
}

function dir(...filePaths) {
  return path.join(__dirname, "..", ...filePaths);
}

exports.dir = dir;
exports.checkDll = checkDll;
