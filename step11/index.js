/**
 * 11. Router 정의하기 // 분기 처리를 담당하는 큰 갈래
 */

const http = require("http");
const { METHODS } = require("http");

class Router {
    constructor() {
        this.stack = [];
    }

    route(url) {
        const route = {};
        route[url] = {};
        this.stack.push(route);

        return route[url];
    }

    handle(req, res) {
        const method = req.method.toLocaleLowerCase();
        const url = req.url;

        /**
         * this.stack
         *
         * [
         *   { '/favicon.ico': { get: [Function (anonymous)] } },
         *   { '/': { get: [Function (anonymous)] } },
         *   { '/dogs': { get: [Function (anonymous)] } },
         *   { '/cats': { get: [Function (anonymous)] } }
         * ]
         */
        for (const route of this.stack) {
            if (route[url] && route[url][method]) {
                route[url][method](req, res);
                return;
            }
        }

        console.log(`${url} 경로에 저장된 handler가 없습니다.`);
    }
}

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.router = new Router();

            METHODS.forEach((METHOD) => {
                const method = METHOD.toLocaleLowerCase();

                this[method] = function (url, handler) {
                    // if (!this.layer[method]) {
                    //     this.layer[method] = {};
                    // }
                    // this.layer[method][url] = handler;

                    const route = this.router.route(url);
                    route[method] = handler;
                };
            });

            console.log("App created.");
        }

        /**
         *
         * @param {http.IncomingMessage} req
         * @param {http.ServerResponse} res
         * @returns void
         */
        handle(req, res) {
            // const url = req.url;
            // const method = req.method.toLowerCase();

            // if (!this.layer[method][url]) {
            //     console.log(`${url} 경로에 저장된 handler가 없습니다.`);
            //     return;
            // }

            // if (!this.router) {
            //     console.log(`${url} 경로에 저장된 handler가 없습니다.`);
            //     return;
            // }

            // this.layer[method][url](req, res);

            this.router.handle(req, res);
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

/**
 *  Router의 stack에 저장된 Route(s) ( Routes === Layer )
 *
 *  { "/favicon.ico" : { get : [Function (anoymous)] } }
 *  { "/" : { get : [Function (anoymous)] } }
 *  { "/dogs" : { get : [Function (anoymous)] } }
 *  { "/cats" : { get : [Function (anoymous)] } }
 */

/**
 * Route(s)에 저장된 handler(s) ( handlers === Layer )
 *
 * { get : [Function (anoymous)] }
 */

// 11-1. 엄밀히 말해 Router 내부에 각 메서드 단위로 Layer가 존재하고, 그 이후 경로로 Route가 존재한다.

// 11-2. Router -> Layer -> Route // 여기서는 Router에서 바로 Route로 직행하게끔 작성되었다.

// 11-3. 더 정확히 말하면 Router는 Layer를 가지고 Layer는 Route들을 가지는데, Route는 다시 Layer를 가진다.
// 11-4. 즉, Layer는 한 경로마다 생성되는 node 이다.
