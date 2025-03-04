const fs = require("fs");

if (fs.existsSync("build")) {
  fs.renameSync("build", "dist");
  console.log("✅ Successfully renamed 'build' to 'dist'.");
} else {
  console.log("⚠️ 'build' folder not found, skipping rename.");
}
