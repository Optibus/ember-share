const { runner } = require("mocha-headless-chrome");
const server = require("./test/js/server");

const options = {
  file: "./test/index.html", // test page path
  reporter: "dot", // mocha reporter name
  width: 800, // viewport width
  height: 600, // viewport height
  timeout: 120000, // timeout in ms
  polling: "raf", // polling mechanism
  // executablePath: '/usr/bin/chrome-unstable',  // chrome executable path
  // visible: true,                               // show chrome window
  args: ["no-sandbox"], // chrome arguments
};

async function run() {
  await server.start();
  const result = await runner(options);
  const json = JSON.stringify(result);
  // process.exit(0);
  // console.log(json);
}

run();
