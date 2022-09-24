/**
 * 1. node.js에서 서버를 여는 법
 */

const http = require("http");
const server = http.createServer(KAKASOO); // ERROR : KAKASOO is not defined.
server.listen(3000);
