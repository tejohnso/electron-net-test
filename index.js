require("./color");
const {app, net} = require('electron');
const {name, version} = require("./package");
const https = require("https");
const opts = {
  hostname: "www.googleapis.com",
  protocol: "https:",
  path: "/storage/v1/b/risevision-display-notifications/o/ZRQCTDDB76YC%2Fcontent.json?alt=media&ifGenerationNotMatch=1501863573011532"
};
const requestors = [
  {fn: net.request, description: "Chromium"},
  {fn: https.request, description: "NodeJS"},
];

app.on('ready', () => {
  console.log(`${name} ${version}\n`);
  console.log(`Sending two requests, both within Electron:`.whiteUnderline);
  console.log(` - one with chromium's networking library
 - one with node's networking library
`.whiteBold);

  return Promise.all(requestors.map(sendRequest))
  .then(app.quit);
})

function sendRequest(requestor) {
  return new Promise(res=>{
    const request = requestor.fn(opts, resp=>{
      resp.on("data", ()=>{});
      resp.on("end", res);
      console.log(`${resp.statusCode} response received from ${requestor.description.whiteBold} for ${opts.hostname}`.green);
    });
    request.end();
    request.on("error", console.error);
  });
};
