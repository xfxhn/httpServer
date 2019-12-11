const BaseRequest = require('./baseRequest');

class BaseServer extends BaseRequest {
    constructor(socket) {
        super();
        this.socket = socket
    }

    runServer() {
        this.receive();
        this.end();
    }

    receive() {
        this.socket.on('data', (data) => {
            this.readFileToArr(data, this.socket);
        });
    }

    end() {
        /*对端发送FIN包的时候触发end*/
        this.socket.on('end', function () {
            console.log('server disconnected');
        });
    }
}


module.exports = BaseServer;

