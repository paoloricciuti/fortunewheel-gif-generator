const express = require("express");
const app = express();

app.get("/", (request, response) => {
    response.json({ ok: true });
});
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});