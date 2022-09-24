/**
 * 2. KAKASOO 정의
 */
const http = require("http");

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.Server Response} res
 * @returns void
 */
const KAKASOO = (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.end("dogs");
};

const server = http.createServer(KAKASOO);
server.listen(3000, () => console.log("server listen."));
