/**
 * 6. handler를 저장하는 get 함수 만들기 ( if으로 작성된 로직 대체하기 )
 */

const http = require("http");

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.layer = {};
            console.log("App created.");
        }

        get(url, handler) {
            this.layer[url] = handler; // Application의 layer에 url 경로를 key 값으로 handler 저장
        }

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
