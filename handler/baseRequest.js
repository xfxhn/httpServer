/*
* 解析请求
* */

const readline = require('readline');
const Duplex = require('stream').Duplex;
const Decode = require('./decode');

class BaseRequest extends Decode {
    constructor() {
        super();
    }

    readFileToArr(data, socket) {
        const stream = BaseRequest.bufferToStream(data)
        const r = readline.createInterface({
            input: stream
        });
        let arr = [];
        r.on('line', function (line) {
            arr.push(line);
        });
        r.on('close', () => {
            const word = arr.shift().split(' ');
            this.handle(word, arr, function (data) {
                /*/!*当TCP连接主动关闭时，会向对端发送一个FIN包表示关闭连接 *!/*/
                // socket.write(data)
                socket.end(data)
            })
        });
    }

    static bufferToStream(buffer) {
        let stream = new Duplex();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}


module.exports = BaseRequest