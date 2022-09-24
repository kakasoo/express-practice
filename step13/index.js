/**
 * 13. Router -> Layer -> Route -> Layer 구조 만들기 ( Router는 path에 따른 분기, Route는 method에 따른 분기)
 */

const http = require("http");
const { METHODS } = require("http");

class Route {
    constructor(url) {
        this.url = url;
        this.stack = [];

        METHODS.forEach((METHOD) => {
            const method = METHOD.toLocaleLowerCase();

            this[method] = function (...handlers) {
                for (const handler of handlers) {
                    const layer = new Layer(method, null, handler);
                    this.stack.push(layer);
                }
            };
        });
    }
}

class Layer {
    constructor(url, route, method) {
        this.url = url;
        this.route = route;
        this.method = method;
    }

    handle(req, res) {
        this.method(req, res);
    }
}

class Router {
    constructor() {
        this.stack = [];
    }

    route(url) {
        const route = new Route(url);
        // NOTE : 달라진 부분은 여기, route를 가리키기 위한 Layer를 stack에 쌓는 점이다.
        const layer = new Layer(url, route);
        this.stack.push(layer);

        return route;
    }

    handle(req, res) {
        const method = req.method.toLocaleLowerCase();
        const url = req.url;

        for (const layer of this.stack) {
            if (layer.url === url) {
                for (const methodLayer of layer.route.stack) {
                    if (methodLayer.url === method) {
                        methodLayer.handle(req, res);
                        return;
                    }
                }
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
                    const route = this.router.route(url);
                    // route[method] = handler;
                    route[method](handler);
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
