const {createServer} = require('../server/index')

/*
* 多个应用监听同一个端口的话，文件描述符在某个时间只能被
* 某个进程所用，这种方式是抢占式的
* */
const server = createServer((req, res) => {
        /*throw new Error()*/
        // console.log(req)
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`<h1>子进程 ${process.pid}</h1>`, 'utf-8')
    }
);
let worker = null;
process.on('message', (m, tcp) => {
    if (m === 'server') {
        /*建立新的 TCP 流时会触发此事件
        * 因为这个tcp服务是在子进程被还原出来的，跟父进程没有任何关系所以即使
        * 父进程关闭服务也不影响子进程建立tcp连接
        * 这样所有子进程都能监听同一个端口了
        * 因为send发送的句柄还原出来的服务，文件描述符是一样的。所以监听相同端口不会引起异常
        * 独立启动启动的进程文件描述符互相之间不知道，所以会实付
        *
        * */
        worker = tcp;
        tcp.on('connection', socket => {
            /*
            * 主动触发connection事件，让工作进程去处理连接请求
            * */
            server.emit('connection', socket)
        })
    }
});
/*这个是进程中有异常会被这个事件监听，这里如果不处理，主线程就会断掉*/
process.on('uncaughtException', function (err) {
    // logger.error(err);
    console.log(err);
    /*向主进程发送信号*/
    process.send({action: 'suicide'})
    /*停止接收新的连接*/
    worker.close(function () {
        /*所有连接断开后，退出进程*/
        process.exit(1)
    });

    /*这里是预防长连接，等待长连接需要很久，所以给出一个限定时间，强制退出*/
    setTimeout(() => {
        process.exit(1)
    }, 5000)
});