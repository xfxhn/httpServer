const readline = require('readline');
const EventEmitter = require('events');
const {Duplex} = require('stream');
const net = require('net');
const Request = require('./request');
const Response = require('./response');

class Server extends EventEmitter {
    constructor(requestListener) {
        super();
        this.requestListener = requestListener;
        this.server = net.createServer(socket => {
            this.request(socket);
        });
        this.connection()
    }

    connection() {
        this.on('connection', socket => {
            this.request(socket)
        })
    }


    request(socket) {
        socket.on('data', data => {
            this.req = new Request(socket);
            this.res = new Response(socket);
            this.readFileToArr(data);
        });
    }

    response(cb) {
        if (cb) {
            cb(this.req, this.res)
        }

    }


    listen(prot, cb) {
        this.server.listen(prot, cb)
    }

    end(socket) {
        /*对端发送FIN包的时候触发end*/
        socket.on('end', function () {
            console.log('server disconnected');
        });
    }


    readFileToArr(data) {
        const stream = Server.bufferToStream(data)
        const r = readline.createInterface({
            input: stream
        });
        /*请求头*/
        let arr = [];
        r.on('line', line => {
            arr.push(line);
        });

        r.on('close', () => {
            /*状态行*/
            const word = arr.shift().split(' ');
            const {version} = this.req.handle(word, arr);
            this.res.setResponseHeader(version);
            this.response(this.requestListener);
        });
    }


    static bufferToStream(buffer) {
        let stream = new Duplex();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}


module.exports = Server;