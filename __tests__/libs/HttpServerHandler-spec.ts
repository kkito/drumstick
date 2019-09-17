import * as net from "net";
import { HttpServerHandler } from "../../src/libs/HttpServerHandler";
import { HttpUtil } from "../../src/utils/HttpUtil";

class TestHttpServerHandler extends HttpServerHandler {
  public mycb?: () => void;
  public beforecb?: () => void;
  public getPendingUrls(): string[] {
    return this.pendingRequestUrls;
  }

  public getPendingResponses(): { [key: string]: string } {
    return this.pendingResponses;
  }

  public triggerDecodeData(data: Buffer) {
    this.onDecodeData(data);
  }

  public send() {
    // do nothing
  }
  protected sendReponses(urls: string[] = []): string[] {
    if (this.beforecb) {
      this.beforecb();
    }
    const result = super.sendReponses(urls);
    if (this.mycb) {
      this.mycb();
    }
    return result;
  }
}

test("request", async done => {
  const socket = new net.Socket();
  const rc4key = "testof rc4key";
  const handler = new TestHttpServerHandler(socket, rc4key);
  HttpUtil.get = jest.fn(() => {
    return Promise.resolve({
      body: Buffer.from("test"),
      headers: {},
      status: 200
    });
  });
  handler.beforecb = () => {
    const urls = handler.getPendingUrls();
    if (urls.length > 0) {
      expect(urls).toEqual(["testurl"]);
    }
  };
  handler.mycb = () => {
    expect(handler.getPendingUrls()).toEqual([]);
    done();
  };
  handler.triggerDecodeData(Buffer.from(JSON.stringify({ url: "testurl" })));
});

test("first request is slow, second is fast", async done => {
  const socket = new net.Socket();
  const rc4key = "testof rc4key";
  const handler = new TestHttpServerHandler(socket, rc4key);
  HttpUtil.get = jest.fn(() => {
    return Promise.resolve({
      body: Buffer.from("test"),
      headers: {},
      status: 200
    });
  });
  HttpUtil.post = jest.fn(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          body: Buffer.from("test"),
          headers: {},
          status: 200
        });
      }, 200);
    });
  });
  handler.beforecb = () => {
    const urls = handler.getPendingUrls();
    const reponses = handler.getPendingResponses();
    if (urls.length === 2) {
      expect(Object.keys(reponses).length).toBeGreaterThanOrEqual(1);
    }
  };
  handler.mycb = () => {
    expect(handler.getPendingUrls()).toEqual([]);
    done();
  };
  handler.triggerDecodeData(
    Buffer.from(JSON.stringify({ url: "testurl2", method: "POST" }))
  );
  handler.triggerDecodeData(Buffer.from(JSON.stringify({ url: "testurl" })));
});
