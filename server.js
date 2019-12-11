/*
* SYN表示建立连接，
* FIN表示关闭连接，
* ACK表示响应
* PSH表示有数据传输
* RST表示连接重置
*/


/*
* 这里客户端和服务端进行连接会首先发送一个SYN标记的包告诉服务端请求建立连接.
* 接着，服务端收到后会发一个对SYN包的确认包(SYN/ACK)回去，表示对第一个SYN包的确
* 认，并继续握手操作.
*
* 然后客户端收到SYN/ACK包,在发送一个确认包（ACK），通知服务端已建立连接
*
* 到这里tcp的三次握手完成
* ACK包就是仅ACK 标记设为1的TCP包. 需要注意的是当三此握手完成、连接建
* 立以后，TCP连接的每个包都会设置ACK位
*
* */

const net = require('net');
const BaseServer = require('./handler/baseServe');
const server = net.createServer(function (socket) {
    new BaseServer(socket).runServer();
});


server.listen(8080);