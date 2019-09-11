import * as net from 'net';
import { BasicServerHandler } from "../../src/libs/BasicServerHandler";
test("init valid", async (done) => {
  const socket = new net.Socket()
  const handler = new BasicServerHandler(socket)
  expect(handler).not.toBeNull()
  handler.setDataReceiveCallback((data:Buffer) => {
    expect(data).toEqual(Buffer.from('test'))
    done()
  })
  socket.emit("data", Buffer.from('test'))
});
