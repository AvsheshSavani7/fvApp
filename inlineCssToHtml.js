const fs = require("fs");
const path = require("path");

// Define paths
const buildDir = path.join(__dirname, "build");
const cssFilesDir = path.join(buildDir, "static", "css");
const htmlFilePath = path.join(buildDir, "index.html");

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

// Find and read CSS files, then inline them into the HTML content
fs.readdirSync(cssFilesDir).forEach((file) => {
  if (file.endsWith(".css")) {
    const cssContent = fs.readFileSync(path.join(cssFilesDir, file), "utf8");
    htmlContent = htmlContent.replace(
      "</head>",
      `<style>${cssContent}</style></head>`
    );
  }
});

// Remove links to external CSS files
htmlContent = htmlContent.replace(
  /<link href="\/static\/css\/.*\.css" rel="stylesheet">/g,
  ""
);

// Write the modified HTML back to the file
fs.writeFileSync(htmlFilePath, htmlContent);
