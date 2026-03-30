const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/admin/objednavky",
  method: "GET",
  headers: {
    "Cookie": "qapi_admin=eyJ2IjoxLCJlbWFpbCI6ImFkbWluQHFhcGkuY3oiLCJleHAiOjE3NzUzMTU4ODZ9.XcYWLSXIJKnRAYZCYHD__FrNUbUmlPRcHnV1vAmyfi4"
  }
};

const req = http.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => body += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Headers:", res.headers);
  });
});

req.on("error", (e) => console.error(e));
req.end();
