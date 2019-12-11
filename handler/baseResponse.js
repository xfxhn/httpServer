/*
* 返回服务
* */
class BaseResponse {
    constructor() {
        this.buffer = [];
        this.size = 0
    }


    setHeader(key, value) {
        const header = `${key}: ${value}\r\n`;
        this.setContent(header)

    }

    endHeader() {
        this.setContent('\r\n')
    }

    encode(msg) {
        const bf = Buffer.from(msg);
        this.buffer.push(bf);
        this.size += bf.length;
    }

    setResponseHeader() {
        const statLine = `HTTP/1.1 200 OK\r\n`;
        this.setContent(statLine);
        this.setHeader('Server', 'xf');
        this.setHeader('Access-Control-Allow-Origin', '*');
        this.setHeader('Date', new Date())
    }

    send() {
        return Buffer.concat(this.buffer, this.size)
    }

    /*转成二进制返回给客户端*/
    setContent(msg) {
        this.encode(msg)
    }


}


module.exports = BaseResponse