const express = require("express");
const googleAiRoute = require("./Routes/google.ai.route");
const app = express();

// Body-Parser POST
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method-Override PUT, DELETE
const methodOverride = require("method-override");
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

app.listen(3000, () => console.log("Working..."));

// Router
const router = require("./Routes/CatRouter");
app.use("/", router);
app.use("/api/v1/", googleAiRoute);

// JWT => Json Web Token
let jwt = require("jsonwebtoken");
let token = jwt.sign({ name: "khamis" }, "secretKhamis", {
  algorithm: "HS256",
});
jwt.verify(token, "secretKhamis");
