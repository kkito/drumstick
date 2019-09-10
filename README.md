# Drumstick 🍗🍗🍗

## 

socket server 
http 加密代理

### TODO

* buffer 内容增加长度
* rc4 加密的 + content length的payload 文件传输
* 客户端生成一个http内容，发送
* server端解析http内容得到，域名等信息，发送
* 包装一个完整的http interface的client

* 自建一个http server 做proxy  https://stackoverflow.com/questions/20351637/how-to-create-a-simple-http-proxy-in-node-js
* 启动server 启动一个 https://nodejs.org/api/net.html#net_ipc_support
* 本地请求使用proxy  https://stackoverflow.com/questions/3862813/how-can-i-use-an-http-proxy-with-node-js-http-client


### 启动

## 服务器

`node lib/server.js` 就会启动server， 具体内容见 `src/server.ts`


## 客户端

暴露类的形式进行调用


### publish on npm 

`npm publish --access public`
