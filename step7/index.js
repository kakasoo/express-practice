/**
 * 7. application 메서드를 통한 내부 로직 재정의
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
            if (!this.layer[url]) {
                console.log(`${url} 경로에 저장된 handler가 없습니다.`);
                return;
            }
            this.layer[url](req, res);
        }
    })();
};

const app = KAKASOO();

app.get("/", (req, res) => res.end("hi"));

const server = http.createServer((req, res) => app.handle(req, res));
server.listen(3000, () => console.log("server listen."));

// 7-1. 우리가 아는 Express의 모습이 생성된다.
