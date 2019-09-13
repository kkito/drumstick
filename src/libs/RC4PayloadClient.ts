import * as net from "net";
import { RC4Util } from "../utils/RC4Util";
import { SizePayloadClient } from "./SizePayloadClient";

export class RC4PayloadClient extends SizePayloadClient {
  protected rc4Key: string;

  constructor(client: net.NetConnectOpts, rc4Key: string) {
    super(client);
    this.rc4Key = rc4Key;
  }

  public send(content: string): Promise<boolean> {
    const rc4Buf = RC4Util.encodeBuffer(Buffer.from(content), this.rc4Key);
    return this.write(rc4Buf);
  }

  protected onPayloadPrepared(payload: Buffer): void {
    const content = RC4Util.decode(payload, this.rc4Key);
    // console.log("payload prepareddd");
    // console.log(content.toString());
    this.onDecodeData(content);
  }

  protected onDecodeData(
    // tslint:disable-next-line:variable-name
    _data: any
  ): void {} // tslint:disable-next-line:no-empty
}
