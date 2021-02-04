const { runner } = require("mocha-headless-chrome");
const fs = require("fs");
const server = require("./test/js/server");

const options = {
  file: "./test/index.html", // test page path
  reporter: "junit", // mocha reporter name
  width: 800, // viewport width
  height: 600, // viewport height
  timeout: 120000, // timeout in ms
  polling: "raf", // polling mechanism
  // executablePath: '/usr/bin/chrome-unstable',  // chrome executable path
  // visible: true,                               // show chrome window
  args: ["no-sandbox", "--out report"], // chrome arguments
};

async function run() {
  await server.start();
  const result = await runner(options);
  const str = JSON.stringify(result);
  fs.writeFileSync("./report.json", str);
  process.exit(0);
}

run();
