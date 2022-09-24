/**
 * 9. get 외의 메서드 ( 여기서는 post ) 구현하기
 */

const http = require("http");

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.layer = {};
            console.log("App created.");
        }

        get(url, handler) {
            if (!this.layer[url]) {
                this.layer[url] = {};
            }
            this.layer[url]["get"] = handler; // Application의 layer에 url 경로를 key 값으로 handler 저장
        }

        post(url, handler) {
            if (!this.layer[url]) {
                this.layer[url] = {};
            }
            this.layer[url]["post"] = handler; // Application의 layer에 url 경로를 key 값으로 handler 저장
        }

        /**
         *
         * @param {http.IncomingMessage} req
         * @param {http.ServerResponse} res
         * @returns void
         */
        handle(req, res) {
            const url = req.url;
            const method = req.method.toLowerCase(); // 소문자로 변경

            if (!this.layer[url][method]) {
                console.log(`${url} 경로에 저장된 handler가 없습니다.`);
                return;
            }
            this.layer[url][method](req, res);
        }
    })();
};

const app = KAKASOO();

app.get("/favicon.ico", (req, res) => res.end("favicon"));

app.get("/", (req, res) => res.end("hi! my name is app!"));
app.get("/dogs", (req, res) => res.end("bark!"));

app.get("/cats", (req, res) => res.end("meow~"));

const server = http.createServer((req, res) => app.handle(req, res));
server.listen(3000, () => console.log("server listen."));

// 9-1. 보다시피 경로 상의 method만 달라질 뿐 handler 등록 메서드 (get, post)의 내부 로직은 동일하다.
