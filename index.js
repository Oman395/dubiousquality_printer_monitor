import { request } from "https";
import Cam from "node-webcam";
import fs from "fs";

let creds = process.argv[2];
let id = process.argv[3];
const DEV_MODE = process.argv[4] !== undefined;
// TODO: For whatever reason, nodejs doesn't like my server's SSL cert, so I'm allowing bad certs.
// This isn't a *huge* issue, but if someone managed to get control over dubiousquality.net, they would have the auth--
// however, if they already have control of the site, I have bigger problems to worry about.
//
// Plus, nobody cares about my tiny little personal site anyway.
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const opts = {
  host: DEV_MODE ? "localhost" : "dubiousquality.net",
  port: DEV_MODE ? 8080 : 443,
  path: "/api/updateP",
  auth: Buffer.from(creds).toString("base64"),
  method: "POST",
};
const cam = Cam.create();

let send = function (pic) {
  return new Promise((res, rej) => {
    let req = request(opts, (rs) => {
      let data = "";
      rs.on("data", (chunk) => (data += chunk));
      rs.on("end", () => {
        data = JSON.parse(data);
        if (data.status === "FAIL") {
          rej(data.error);
        }
        console.log("Done sending!");
        res();
      });
    });
    console.log("Sending!");
    req.end(
      JSON.stringify({
        img: pic.toJSON(),
        id,
      })
    );
  });
};

let loop = function () {
  console.log("Taking picture!");
  cam.capture("pic", (err) => {
    let time = Date.now();
    if (err) console.error(err);
    send(fs.readFileSync("./pic.jpg"))
      .then(() => {
        let deltaT = Date.now() - time;
        setTimeout(loop, 60000 - deltaT);
      })
      .catch((e) => {
        console.error("Error from server! Error: " + e);
        let deltaT = Date.now() - time;
        setTimeout(loop, 60000 - deltaT);
      });
  });
};
loop();
