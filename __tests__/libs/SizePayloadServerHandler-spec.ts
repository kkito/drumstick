import * as net from "net";
import { SizePayloadServerHandler } from "../../src/libs/SizePayloadServerHandler";
import { BufferUtil } from "../../src/utils/BufferUtil";

test("regular size scenario", async done => {
  const socket = new net.Socket();
  const handler = new SizePayloadServerHandler(socket);
  const content = Buffer.from("this is a test");
  const sendData = BufferUtil.sizeWithBuffer(content);
  handler.setPayloadPrepareCallback((data:Buffer) => {
    expect(data.toString()).toEqual("this is a test")
    done()
  })
  socket.emit("data" , sendData)
});
