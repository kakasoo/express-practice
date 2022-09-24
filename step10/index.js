/**
 * 10. 한꺼번에 모든 메서드 등록하기
 */

const http = require("http");
const { METHODS } = require("http");

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.layer = {};

            METHODS.forEach((METHOD) => {
                const method = METHOD.toLocaleLowerCase();

                this[method] = function (url, handler) {
                    if (!this.layer[method]) {
                        this.layer[method] = {};
                    }
                    this.layer[method][url] = handler;
                };
            });

            console.log("App created.");
        }

        // get(url, handler) {
        //     if (!this.layer[url]) {
        //         this.layer[url] = {};
        //     }
        //     this.layer[url]["get"] = handler; // Application의 layer에 url 경로를 key 값으로 handler 저장
        // }

        // post(url, handler) {
        //     if (!this.layer[url]) {
        //         this.layer[url] = {};
        //     }
        //     this.layer[url]["post"] = handler; // Application의 layer에 url 경로를 key 값으로 handler 저장
        // }

        /**
         *
         * @param {http.IncomingMessage} req
         * @param {http.ServerResponse} res
         * @returns void
         */
        handle(req, res) {
            const url = req.url;
            const method = req.method.toLowerCase();

            if (!this.layer[method][url]) {
                console.log(`${url} 경로에 저장된 handler가 없습니다.`);
                return;
            }
            this.layer[method][url](req, res);
        }
    })();
};

const app = KAKASOO();

app.get("/favicon.ico", (req, res) => res.end("favicon"));

app.get("/", (req, res) => res.end("hi! my name is app!"));
app.get("/dogs", (req, res) => res.end("bark!"));
app.get("/cats", (req, res) => res.end("meow~"));
app.post("/dogs", res.end("create dogs"));

const server = http.createServer((req, res) => app.handle(req, res));
server.listen(3000, () => console.log("server listen."));

// 10-1. layer의 method와 url 순서를 바꿔줘서 매핑을 하고, forEach문으로 한꺼번에 handler 등록함수 생성

// 10-2. handle method에서도 method, url key 순서를 바꿔준다.
