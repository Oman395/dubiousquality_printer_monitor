import https from "https";

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
  path: "/api/addUser",
  method: "POST",
};

let req = https.request(opts, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    data = JSON.parse(data);
    if (data.status === "SUCCESS") {
      console.log(
        `<==================================================================================================================================>
Account Made! Username: ${process.argv[2]}, password: ${process.argv[3]}. If you misspelled one of those, I haven't made a way to 
change them through the API, so just shoot me an email at oranroha@gmail.com or contact me on discord at AutisticMOFO#0521. 
From here, you can find docs at dubiousquality.net/projects, on the bottom, and if you need help, don't hesitate to contact me.
<==================================================================================================================================>`
      );
    } else {
      console.log(
        `<==================================================================================================================================>
Account creation failed! Code: ${res.statusCode}, error: ${data.error}
<==================================================================================================================================>`
      );
    }
  });
});

if (!process.argv[3]) console.log("Missing credentials!");

console.log(`<==================================================================================================================================>
Making Account!
<==================================================================================================================================>`);

req.end(
  JSON.stringify({
    user: process.argv[2],
    pass: process.argv[3],
  })
);
