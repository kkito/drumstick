import * as net from "net";
import { LogUtil } from "../utils/LogUtil";

export class BasicServerHandler {
  protected client: net.Socket;
  protected datas: Buffer[];
  protected dataSize = 0;
  protected dataReceiveCallback?: (data: Buffer) => void;
  protected timeoutMillSeconds = 6000; // 60 seconds

  constructor(client: net.Socket) {
    this.client = client;
    this.datas = [];

    client.on("data", data => {
      this.onDataReceive(data);
    });

    client.on("close", () => {
      LogUtil.debug("client was closed");
      this.close();
      // console.log(`new client was contected ${server.getConnections()}`)
    });

    client.on("error", () => {
      LogUtil.debug("error");
      this.close();
    });

    client.on("timeout", () => {
      LogUtil.debug("timeout");
      this.close();
    });
  }

  public setDataReceiveCallback(cb: (data: Buffer) => void) {
    this.dataReceiveCallback = cb;
  }

  public write(content: string | Buffer): void {
    this.client.write(content);
  }

  public send(content: string): void {
    return this.write(content);
  }

  public close(): void {
    this.client.end();
  }

  public setTimeout(timeout: number): void {
    this.timeoutMillSeconds = timeout;
  }

  protected onDataReceive(data: Buffer): void {
    this.client.setTimeout(this.timeoutMillSeconds);
    this.datas.push(data);
    this.dataSize += data.length;
    if (this.dataReceiveCallback) {
      this.dataReceiveCallback(data);
    }
  }
}
