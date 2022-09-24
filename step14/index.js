/**
 * 14. 코드 중간 점검 겸 리팩터링 / Route의 hasMethod와 handle을 작성하여 Router handle의 for문을 분리
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
                // for (const methodLayer of layer.route.stack) {
                //     if (methodLayer.path === method) {
                //         methodLayer.handle(req, res);
                //         return;
                //     }
                // }

                // NOTE : 동일한 경로에 동일한 메서드는 한 개만 존재할 수 있다.
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

                this[method] = (path, handler) => {
                    const route = this.router.route(path);
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

/**
 * Router와 Route의 차이는?
 *
 * 분기 기준이 무엇이냐의 차이가 있을 뿐, 둘의 구현은 거의 유사하다.
 *
 * Router도 서버인가?
 *
 * Router도 어떻게 보면 하나의 서버를 담당할 수 있고,
 * 하나의 서버도 다르게 생각하면 Router라, 서로 다른 서버를 합칠 수도 있겠다.
 */

// NOTE : 이제 분기 처리가 url만 있는 게 아니므로 모두 path 라는 식별자로 변경한다.
