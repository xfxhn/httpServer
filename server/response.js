class Response {

    constructor(socket) {
        this.socket = socket;
        this.buffer = [];
        this.size = 0;
    }

    end(data, encode) {
        let bf = 0;
        if (!(data instanceof Buffer)) {
            bf = Buffer.from(data);
        }

        this.setHeader('Content-Length', bf.length);

        this.endHeader();
        this.setContent(data, encode);

        const buffer = Buffer.concat(this.buffer, this.size);
        this.socket.end(buffer);
    }

    json(data) {
        const jsonStr = JSON.stringify(data);
        const length = Buffer.from(jsonStr);
        this.setResponseHeader('HTTP:1.1');
        this.setHeader('Content-Length', length);
        this.endHeader();

        this.setContent(jsonStr);
        const buffer = Buffer.concat(this.buffer, this.size);
        this.socket.end(buffer)
    }

    setHeader(key, value) {
        const header = `${key}: ${value}\r\n`;
        this.setContent(header)

    }

    setResponseHeader(version) {
        const statLine = `${version} 200 NICE\r\n`;
        this.setContent(statLine);
        this.setHeader('Server', 'xf');
        this.setHeader('Date', new Date());
        this.setHeader('Access-Control-Allow-Origin', '*');

    }

    setContent(data, encode) {
        this.encode(data, encode)
    }

    endHeader() {
        this.setContent('\r\n')
    }

    encode(data, encode = '') {
        if (!(data instanceof Buffer)) {
            data = Buffer.from(data, encode);
        }
        this.buffer.push(data);
        this.size += data.length;
    }
}

module.exports = Response;