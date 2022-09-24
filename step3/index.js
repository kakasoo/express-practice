/**
 * 3. URL 경로에 따라 다르게 동작하는 서버
 */
const http = require("http");

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @returns void
 */
const KAKASOO = (req, res) => {
    res.setHeader("Content-Type", "text/plain");

    // console.log(req);

    if (req.url === "/") {
        return res.end("/");
    }

    if (req.url === "/cats") {
        return res.end("/cats");
    }

    if (req.url === "/dogs") {
        return res.end("/dogs");
    }
};

const server = http.createServer(KAKASOO);
server.listen(3000, () => console.log("server listen."));
