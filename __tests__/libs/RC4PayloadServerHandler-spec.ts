import * as net from "net";
import { RC4PayloadServerHandler } from "../../src/libs/RC4PayloadServerHandler";
import { BufferUtil } from "../../src/utils/BufferUtil";
import { RC4Util } from "../../src/utils/RC4Util";

class MyRc4ServerHandler extends RC4PayloadServerHandler {
  protected myCB?: (data: Buffer) => void;

  public setMyCB(cb: (data: Buffer) => void) {
    this.myCB = cb;
  }
  protected onDecodeData(
    // tslint:disable-next-line:variable-name
    data: Buffer
  ): void {
    if (this.myCB) {
      this.myCB(data);
    }
  }
}

test("rc4 decode data", async done => {
  const socket = new net.Socket();
  const rc4key = "testof rc4key";
  const handler = new MyRc4ServerHandler(socket, rc4key);
  const content = Buffer.from("this is a test");
  const encrpedBuffer = RC4Util.encodeBuffer(content, rc4key);
  const payloadBuffer = BufferUtil.sizeWithBuffer(encrpedBuffer);
  handler.setMyCB((data: Buffer) => {
    expect(data.toString()).toEqual("this is a test");
    done();
  });
  socket.emit("data", payloadBuffer);
});

test("rc4 multi request data", async done => {
  const socket = new net.Socket();
  const rc4key = "testof rc4key";
  const handler = new MyRc4ServerHandler(socket, rc4key);
  const content = Buffer.from("this is a test");
  const encrpedBuffer = RC4Util.encodeBuffer(content, rc4key);
  const payloadBuffer = BufferUtil.sizeWithBuffer(encrpedBuffer);
  let receiveSize = 0;
  handler.setMyCB((data: Buffer) => {
    receiveSize += 1;
    expect(data.toString()).toEqual("this is a test");
    if (receiveSize === 4) {
      done();
    }
  });
  const allInOne = Buffer.concat([
    payloadBuffer,
    payloadBuffer,
    payloadBuffer,
    payloadBuffer
  ]);

  socket.emit("data", allInOne.slice(0, 1));
  socket.emit("data", allInOne.slice(1, 3));
  socket.emit("data", allInOne.slice(3, 28));
  socket.emit("data", allInOne.slice(28));
});
