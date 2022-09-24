/**
 * 15. middleware는 어떻게 동작하는가?
 */

const http = require("http");
const { METHODS } = require("http");

class Route {
    constructor(path) {
        this.path = path;
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
            if (layer.path === method) {
                layer.handle(req, res);
            }
        }
    }
}

class Layer {
    constructor(path, route, method) {
        this.path = path;
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

    route(path) {
        const route = new Route(path);
        const layer = new Layer(path, route);
        this.stack.push(layer);

        return route;
    }

    handle(req, res) {
        const method = req.method.toLocaleLowerCase();
        const path = req.path;

        for (const layer of this.stack) {
            if (layer.path === path && layer.route.hasMethod(method)) {
                layer.route.handle(req, res);
                return;
            }
        }

        console.log(`${path} 경로에 저장된 handler가 없습니다.`);
    }
}

const KAKASOO = () => {
    return new (class App {
        constructor() {
            this.router = new Router();

            METHODS.forEach((METHOD) => {
                const method = METHOD.toLocaleLowerCase();

                // NOTE : 여러 개의 함수를 받을 수 있도록 수정
                this[method] = (path, ...handlers) => {
                    const route = this.router.route(path);
                    route[method](handlers);
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
