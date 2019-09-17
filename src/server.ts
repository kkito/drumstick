import * as net from "net";
import { HttpServerHandler } from "./libs/HttpServerHandler";
import { RC4PayloadServerHandler } from "./libs/RC4PayloadServerHandler";
// import { BasicServerHandler } from './libs/BasicServerHandler'
// import { SizePayloadServerHandler } from './libs/SizePayloadServerHandler'

class TestServer extends RC4PayloadServerHandler {
  protected onDecodeData(
    // tslint:disable-next-line:variable-name
    _data: any
  ): void {
    // tslint:disable-next-line:no-empty
    console.log("on decode data");
    console.log(_data);
    console.log(_data.toString());
    this.send("return back hello world2");
    this.close();
  }
}
console.log(TestServer);

const defaultOptions = {
  host: "0.0.0.0",
  maxConnections: 100,
  port: 4812,
  secret: "testkey",
  timeout: 1000 * 60 * 2 // timeout 2 minutes
};

process.argv.forEach(val => {
  const paramSplit = val.split("=");
  if (paramSplit.length > 1) {
    const attr = paramSplit[0];
    if (Object.keys(defaultOptions).includes(attr)) {
      const attrValue = val.slice(attr.length + 1);
      const myo: any = defaultOptions;
      // tslint:disable-next-line:prefer-conditional-expression
      if (myo[attr] instanceof Number) {
        myo[attr] = parseInt(attrValue, 10);
      } else {
        myo[attr] = attrValue;
      }
      console.log(`attr == ${attr} - ${val}`);
    }
  }
});

const server = net.createServer(client => {
  // https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback
  client.setTimeout(defaultOptions.timeout); // 默认timeout时间
  // tslint:disable-next-line:no-unused-expression
  new HttpServerHandler(client, defaultOptions.secret);
  // new SizePayloadServerHandler(client)
  // new BasicServerHandler(client)
  /*
  client.on('data', (data) => {
    console.log(`content is ${data}`)
    client.write('i was reponsed!!')
  })

  client.on('close', () => {
    console.log('client was closed')
    // console.log(`new client was contected ${server.getConnections()}`)
  })

  client.on('error', () => {
    console.log('error')
  })

  client.on('timeout', () => {
    console.log('timeout')
  })
  */
});

server.maxConnections = defaultOptions.maxConnections;

// no-check-certificate, TODO make it option for start server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// npx ts-node src/server.ts secret=yourSecretKey port=4913
server.listen(defaultOptions.port, defaultOptions.host, () => {
  console.log("done");
  console.log(`listen port ${defaultOptions.port}`);
});
