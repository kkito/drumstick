// import * as iconv from 'iconv-lite';
// import * as net from 'net'
// import * as fs from 'fs';
const options = { port: 4821, host: "127.0.0.1" };
// import { HttpUtil } from "./utils/HttpUtil";
// const socket = net.connect({port: 4821 , host: '127.0.01'} , () => {
//   socket.write('hello world')
// })

// socket.on('data' , (data) =>{
//   console.log(`reponse data is ${data}`)
//   socket.end()
// })

// import { BasicClient } from "./libs/BasicClient";
// async function main() {
//   const client = new BasicClient(options);
//   await client.connect();
//   client.write("hello world");
//   client.close();
// }

// import { SizePayloadClient } from "./libs/SizePayloadClient";
// async function main2() {
//   const client = new SizePayloadClient(options);
//   await client.connect();
//   client.write(Buffer.from("hello world"));
//   client.close();
// }

import { DrumstickClient } from "./libs/DrumstickClient";
async function main2() {
  const client = new DrumstickClient(options, "testkey");
  // let result = await client.request('http://www.baidu.com/');
  // const content = iconv.decode(Buffer.from(result.body), 'gbk');
  // content = iconv.decode(Buffer.from(content), 'gbk');
  // content = iconv.decode(Buffer.from(content), 'gbk');
  // console.log(iconv.decode(Buffer.from(result.body), 'gbk'));
  // const buf = new Buffer(result.body, 'base64')
  // const content = buf.toString('gbk')
  // const content = iconv.decode(buf, 'gbk')
  // console.log(result.body.length)
  // console.log(result.body)
  // result = await client.request('http://www.baidu.com/');
  // console.log(result.body);
  try {
    const result = await client.request(
      "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png",
      {},
      "binary"
    );
    // const result = await client.request('http://www.baidu.com/');
    console.log(result.body.length);
    console.log(result.headers);
  } catch (err) {
    console.log(err);
  }
  // await fs.writeFileSync('/tmp/test.png', result.body);
  // console.log(client);
  // console.log(content.body)
  // console.log(iconv.decode(Buffer.from(content.body), 'gbk'))
}
// main();
main2();
