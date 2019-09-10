import * as net from 'net';
import { LogUtil } from '../utils/LogUtil';
import { RC4Util } from '../utils/RC4Util';
import { SizePayloadServerHandler } from './SizePayloadServerHandler';

export class RC4PayloadServerHandler extends SizePayloadServerHandler {
  protected rc4Key: string;

  constructor(client: net.Socket, rc4Key: string) {
    super(client);
    this.rc4Key = rc4Key;
  }

  public write(content: string | Buffer): void {
    const buf = content instanceof Buffer ? content : Buffer.from(content);
    const sizeAndBuffer = RC4Util.decode(buf, this.rc4Key);
    super.write(sizeAndBuffer);
  }

  protected onPayloadPrepared(payload: Buffer): void {
    const content = RC4Util.decode(payload, this.rc4Key);
    // console.log("payload prepareddd");
    // console.log(content.toString());
    this.onDecodeData(content);
  }

  protected onDecodeData(
    // tslint:disable-next-line:variable-name
    data: Buffer
  ): void {
    // tslint:disable-next-line:no-empty
    LogUtil.debug(`onDecodeData data size: ${data.length}`);
  }
}
