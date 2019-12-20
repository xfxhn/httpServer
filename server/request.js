const url = require('url');


class Request {
    constructor(socket) {
        // this.socket = socket;
        this.desc = null;
    }

    handle(word, header) {
        const {headers, body} = this.parseHeader(header);

        const [method, path, version] = word;
        const {pathname, query} = url.parse(path, true);
        const desc = {
            method,
            pathname,
            version,
            headers,
            query,
            body,
        };

        this.desc = desc;
        return desc;
    }

    parseHeader(header) {
        let headers = {};
        let body = header.pop();
        header.forEach(val => {
            let [key, value] = val.split(':');
            headers[key] = value
        });
        body = body ? JSON.parse(body) : null;
        return {
            headers,
            body
        }
    }
}


module.exports = Request;