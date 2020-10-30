const express = require("express");
const app = express();

app.get("/", (request, response) => {
    response.json({ok: true});
});