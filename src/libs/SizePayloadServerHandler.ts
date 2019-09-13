import { BufferUtil } from "../utils/BufferUtil";
import { LogUtil } from "../utils/LogUtil";
import { BasicServerHandler } from "./BasicServerHandler";

export class SizePayloadServerHandler extends BasicServerHandler {
  protected payloadSize: number | null = null;
  protected payloadPrepareCallback?: (data: Buffer) => void;

  public write(content: string | Buffer): void {
    const buf = content instanceof Buffer ? content : Buffer.from(content);
    const sizeAndBuffer = BufferUtil.sizeWithBuffer(buf);
    super.write(sizeAndBuffer);
  }

  public setPayloadPrepareCallback(cb: (data: Buffer) => void) {
    this.payloadPrepareCallback = cb;
  }

  protected onDataReceive(data: Buffer): void {
    super.onDataReceive(data);
    if (!this.payloadSize) {
      if (this.dataSize > 4) {
        const buf = Buffer.concat(this.datas);
        this.payloadSize = buf.readInt32BE(0);
      }
    }

    if (this.payloadSize) {
      if (this.dataSize >= this.payloadSize) {
        // 已经完整接收到数据了
        this.onCompleteData();
      }
    }
  }

  // tslint:disable-next-line:no-empty
  protected onPayloadPrepared(payload: Buffer): void {
    LogUtil.debug(`onPayloadPrepread: size ${payload.length}`);
    if (this.payloadPrepareCallback) {
      this.payloadPrepareCallback(payload);
    }
  }

  protected onCompleteData(): void {
    const allBuf = Buffer.concat(this.datas);
    if (this.payloadSize && this.payloadSize <= this.dataSize) {
      const buf = allBuf.slice(0, this.payloadSize);
      const { payload } = BufferUtil.extractSize(buf);
      this.onPayloadPrepared(payload);

      // reset for next content
      this.datas = []
      this.dataSize = 0
      this.onDataReceive(allBuf.slice(this.payloadSize))
      this.payloadSize = null
    } else {
      throw new Error(`payloadSize invalid ${this.payloadSize}`);
    }
  }
}
