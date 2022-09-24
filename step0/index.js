const express = require("express");
const http = require("http");
const path = require("path");

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.render("index", { title: "test" });
});

app.post("/login", (req, res) => {
    res.send({ data: "test" });
});

server.listen(3000, () => console.log("server opened."));
