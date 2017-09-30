require("./color");
const {log} = console;
const {app, net} = require('electron');
const {name, version} = require("./package");
const https = require("https");
const breakNodeJS = false;
const opts = {
  hostname: "www.googleapis.com",
  protocol: "https:",
  agent: breakNodeJS ? false : null,
  ca: breakNodeJS ? "a" : null,
  path: "/storage/v1/b/risevision-display-notifications/o/ZRQCTDDB76YC%2Fcontent.json?alt=media&ifGenerationNotMatch=1501863573011532"
};
const requestors = [
  {fn: net.request, description: "Chromium"},
//  {fn: https.request, description: "NodeJS"},
];

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  log(event);
  log(url)
  log(error);
  event.preventDefault()
  callback(true)
});

app.on('select-client-certificate', (event, webContents, url, list, callback) => {
  log(event);
  log(url)
  event.preventDefault()
  callback()
})

app.on('ready', () => {
  log(`${name} ${version}\n`);
  log(`Sending two requests, both within Electron:`.whiteUnderline);
  log(` - one with chromium's networking library
 - one with node's networking library
`.whiteBold);

  return Promise.all(requestors.map(sendRequest))
  .then(app.quit);
})

function sendRequest(requestor) {
  return new Promise(res=>{
    const request = requestor.fn(opts, resp=>{
      resp.resume();
      resp.on("end", res);
      log(`${resp.statusCode} response received from ${requestor.description.whiteBold} for ${opts.hostname}`.green);
    });

    request.on("error", err=>{log(`Error from ${requestor.description.whiteBold}`.green), log(err), res()});
    request.on("aborted", ()=>log(`Aborted from ${requestor.description.whiteBold}`.green));
    request.on("abort", ()=>log(`Abort from ${requestor.description.whiteBold}`.green));
    request.on("continue", ()=>log(`Continue from ${requestor.description.whiteBold}`.green));
    request.on("connect", ()=>log(`Connected to ${requestor.description.whiteBold}`.green));
    request.on("socket", ()=>log(`Socket assigned for ${requestor.description.whiteBold}`.green));

    log(`Requesting ${opts.hostname} from ${requestor.description.whiteBold}`.green);
    debugger;
    request.end();
  });
}
