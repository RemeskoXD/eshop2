const http = require("http");

const data = "email=admin%40qapi.cz&password=JNDSIUAD76SD.*s&next=%2Fadmin%2Fobjednavky";

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/admin/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => body += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Headers:", res.headers);
    console.log("Body:", body);
  });
});

req.on("error", (e) => console.error(e));
req.write(data);
req.end();
