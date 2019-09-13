import * as net from "net";
import { SizePayloadServerHandler } from "../../src/libs/SizePayloadServerHandler";
import { BufferUtil } from "../../src/utils/BufferUtil";

test("regular size scenario", async done => {
  const socket = new net.Socket();
  const handler = new SizePayloadServerHandler(socket);
  const content = Buffer.from("this is a test");
  const sendData = BufferUtil.sizeWithBuffer(content);
  handler.setPayloadPrepareCallback((data: Buffer) => {
    expect(data.toString()).toEqual("this is a test");
    done();
  });
  socket.emit("data", sendData);
});

test("send data with many times", async done => {
  const socket = new net.Socket();
  const handler = new SizePayloadServerHandler(socket);
  const content = Buffer.from("this is a test");
  const sendData = BufferUtil.sizeWithBuffer(content);
  const mockCB = jest.fn();
  handler.setDataReceiveCallback(mockCB);
  handler.setPayloadPrepareCallback((data: Buffer) => {
    expect(data.toString()).toEqual("this is a test");
    expect(mockCB.mock.calls.length).toBe(4);
    done();
  });
  socket.emit("data", sendData.slice(0, 1));
  socket.emit("data", sendData.slice(1, 3));
  socket.emit("data", sendData.slice(3, 8));
  socket.emit("data", sendData.slice(8));
});

test("send multi requests", async done => {
  const socket = new net.Socket();
  const handler = new SizePayloadServerHandler(socket);
  const content = Buffer.from("this is a test");
  const sendData = BufferUtil.sizeWithBuffer(content);
  const mockCB = jest.fn();
  handler.setDataReceiveCallback(mockCB);
  let receiveTimes = 0;
  handler.setPayloadPrepareCallback((data: Buffer) => {
    receiveTimes += 1;
    expect(data.toString()).toEqual("this is a test");
    // expect(mockCB.mock.calls.length).toBe(4)
    if (receiveTimes === 5) {
      done();
    }
  });
  socket.emit("data", sendData);
  socket.emit("data", sendData);
  socket.emit("data", sendData);
  socket.emit("data", sendData);
  socket.emit("data", sendData);
});
