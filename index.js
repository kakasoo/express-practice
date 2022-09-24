/**
 * 16. 서버 로직 상의 에러를 처리하는 방법
 */

const http = require("http");
const { METHODS } = require("http");

class Route {
    constructor(url) {
        this.url = url;
        this.stack = [];
        this.methods = {};

        METHODS.forEach((METHOD) => {
            const method = METHOD.toLocaleLowerCase();

            /**
             * 사실 middleware가 동작할 수 있도록 미리 작성해두었다.
             * 함수를 배열로 받아서, 일치하는 경우 순서대로 모두 실행시키도록 한 것.
             */
            this[method] = (...handlers) => {
                for (const handler of handlers) {
                    const layer = new Layer(method, null, handler);

                    this.methods[method] = true;
                    this.stack.push(layer);
                }
            };
        });
    }

    hasMethod(method) {
        return this.methods[method] ? true : false;
    }

    handle(req, res) {
        const method = req.method.toLocaleLowerCase();
        for (const layer of this.stack) {
            if (layer.url === method) {
                layer.handle(req, res);
            }
        }
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
        const layer = new Layer(url, route);
        this.stack.push(layer);

        return route;
    }

    handle(req, res) {
        const method = req.method.toLocaleLowerCase();
        const url = req.url;

        for (const layer of this.stack) {
            if (layer.url === url && layer.route.hasMethod(method)) {
                layer.route.handle(req, res);
                return;
            }
        }

        throw new Error(`${url} 경로에 저장된 handler가 없습니다.`);
    }
}

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.router = new Router();

            METHODS.forEach((METHOD) => {
                const method = METHOD.toLocaleLowerCase();

                this[method] = (url, ...handlers) => {
                    const route = this.router.route(url);
                    route[method](handlers);
                };
            });

            console.log("App created.");
        }

        // NOTE : 서버의 모든 에러는 Application의 try/catch 문에서 잡히게 되어 있다.

        /**
         *
         * @param {http.IncomingMessage} req
         * @param {http.ServerResponse} res
         * @returns void
         */
        handle(req, res) {
            try {
                this.router.handle(req, res);
            } catch (err) {
                console.error("ERROR : ", err.message);
            }
        }
    })();
};

const app = KAKASOO();

app.get("/favicon.ico", (req, res) => res.end("favicon"));

app.get(
    "/",
    (req, res) => console.log(123),
    (req, res) => res.end("hi! my name is app!")
);
app.get(
    "/dogs",
    (req, res) => console.log(123),
    (req, res) => res.end("bark!")
);
app.get("/cats", (req, res) => res.end("meow~"));

const server = http.createServer((req, res) => app.handle(req, res));
server.listen(3000, () => console.log("server listen."));
