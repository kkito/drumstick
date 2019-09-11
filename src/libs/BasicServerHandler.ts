import * as net from 'net';
import { LogUtil } from '../utils/LogUtil';

export class BasicServerHandler {
  protected client: net.Socket;
  protected datas: Buffer[];
  protected dataSize = 0;
  protected dataReceiveCallback?:(data:Buffer) => void

  constructor(client: net.Socket) {
    this.client = client;
    this.datas = [];

    client.on('data', data => {
      this.datas.push(data);
      this.dataSize += data.length;
      this.onDataReceive(data);
    });

    client.on('close', () => {
      LogUtil.debug('client was closed');
      // console.log(`new client was contected ${server.getConnections()}`)
    });

    client.on('error', () => {
      LogUtil.debug('error');
    });

    client.on('timeout', () => {
      LogUtil.debug('timeout');
    });
  }

  public setDataReceiveCallback(cb:(data:Buffer)=>void) {
    this.dataReceiveCallback = cb
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

  protected onDataReceive(data: Buffer): void {
    if (this.dataReceiveCallback) {
      this.dataReceiveCallback(data)
    }
  }
}
