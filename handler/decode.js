const BaseResponse = require('./baseResponse');
const url = require('url');
const fs = require("fs");
const path = require('path');

class Decode extends BaseResponse {
    constructor() {
        super();
        this.body = null;
        this.header = null;
    }

    handGet(path, cb) {
        const {pathname, query} = url.parse(path, true);
        this.resource(pathname, cb)
    }

    handPost(path, cb) {
        if (path === '/api/login') {
            const json = this.body;
            let data = JSON.stringify(json);
            const buf = Buffer.from(data);
            this.setHeader('Content-Length', buf.length);
            this.endHeader();
            this.setContent(data);
            cb(this.send())
        }
        // this.resource(path, cb)
    }

    /*解析请求*/
    handle(args, header, cb) {
        this.setResponseHeader();
        this.parseHeader(header);
        const [method, path, version] = args;
        if (method === 'GET') {
            this.handGet(path, cb)
        } else if (method === 'POST') {
            this.handPost(path, cb)
        }
    }

    parseHeader(header) {
        let map = {};
        let body = header.pop();
        header.forEach(val => {
            let [key, value] = val.split(':');
            map[key] = value
        });
        this.header = map;
        if (body) {
            this.body = JSON.parse(body);
        }
    }

    /*资源路径*/
    resource(pathname, cb) {
        if (pathname === '/') {
            const PATH = path.resolve(__dirname, '../template/index.html');
            fs.readFile(PATH, (err, data) => {
                if (err) {
                    return console.error(err)
                }
                this.setHeader('Content-Length', data.length);
                this.endHeader();
                this.setContent(data);
                cb(this.send())
            })

        } else {
            const PATH = path.resolve(__dirname, '../template/404.html');

            fs.readFile(PATH, (err, data) => {
                if (err) {
                    return console.error(err)
                }
                this.setHeader('Content-Length', data.length);
                this.endHeader();
                this.setContent(data);
                cb(this.send())
            })
        }
    }


}


module.exports = Decode;