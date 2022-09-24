/**
 * 5. handler를 호출하는 handle 함수 만들기
 */

const http = require("http");

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.layer = {}; // 5-3
            console.log("App created.");
        }

        // NOTE : 실행을 위한 함수
        /**
         *
         * @param {http.IncomingMessage} req
         * @param {http.ServerResponse} res
         * @returns void
         */
        handle(req, res) {
            const url = req.url;
            this.layer[url](req, res); // 저장된 handler를 찾아서 호출한다.
        }
    })();
};

const app = KAKASOO();
const server = http.createServer((req, res) => app.handle(req, res));
server.listen(3000, () => console.log("server listen."));
