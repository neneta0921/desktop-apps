const path = require("path");
const os = require("os");

document.getElementById("output-path").textContent = path.join(
  os.homedir(),
  "imageshrink"
);
