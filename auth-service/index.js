const express = require("express");
const router = require("./routes/router");
const app = express();
require("./auth-connection")

app.use(express.json());
app.use(router)

app.listen(7001, () => {
    console.log(`Auth-Service at 7001`);
});