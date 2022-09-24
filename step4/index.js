/**
 * 4. KAKASOO app을 생성하는 함수로 변경
 */

const http = require("http");

/**
 *
 * @returns Application is created by KAKASOO
 */
const KAKASOO = () => {
    return new (class App {
        /**
         *
         * @param {http.IncomingMessage} req
         * @param {http.ServerResponse} res
         * @returns void
         */
        someFunc(req, res) {}
    })();
};

const app = KAKASOO();
const server = http.createServer((req, res) => app.someFunc(req, res));
server.listen(3000, () => console.log("server listen."));
