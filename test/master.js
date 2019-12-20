/*
* 文件描述符是由无符号整数表示的句柄，进程使用它来标识打开的文件
* */

const {fork} = require('child_process');
const cpus = require('os').cpus();
const {createServer} = require('http');


const server = createServer();

server.listen(8000, function () {
    const workers = {};

    function createWorker() {
        const worker = fork('./worker.js');

        /*退出重启新的进程*/
        worker.on('exit', function () {
            console.log(this.pid, '退出');
            delete workers[this.pid];
            /*创建新的进程*/
            createWorker();
        });

        /*这里是接收到子进程的的异常，重启一个进程
        * 一旦有异常立即重启一个进程，旧的处理完连接自动退出
        * 完成进程的平滑重启
        * */
        worker.on('message', function (msg) {
            if (msg.action === 'suicide') {
                createWorker()
            }

        })
        workers[worker.pid] = worker;
        console.log('线程id', worker.pid);

        /*
        * 这里是句柄发送，发送给子进程文件描述符，然后子进程通过文件描述符来还原这个服务
        * 实质上还是发送的经过序列化的值
        * 这里解决的是如果用代理进程监听端口，就会用掉两个文件描述符
        * 这里实现的是多个进程监听一个端口
        * */
        worker.send('server', server)
    }

    for (let i = 0; i < cpus.length; i++) {
        createWorker();
    }

    /*这里关掉服务器的监听，让所有业务由工作线程去处理，不然有可能会被父进程处理*/
    // server.close()
});

console.log(process.pid, '主进程ID');
/*主进程退出，让所有子进程退出*/
process.on('exit', function (code) {
    for (let pid in workers) {
        workers[pid].kill()
    }
});


