import { BufferUtil } from "../utils/BufferUtil";
import { BasicClient } from "./BasicClient";

export class SizePayloadClient extends BasicClient {
  protected payloadSize: number | null = null;

  public write(buf: Buffer): Promise<boolean> {
    const buffer = BufferUtil.sizeWithBuffer(buf);
    return super.write(buffer);
  }
  public connect(): Promise<boolean> {
    return super.connect();
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
        this.isCompleted = true;
        if (this.completedTimer) {
          clearTimeout(this.completedTimer);
        }
        this.onCompleteData();
      }
    }
  }

  // tslint:disable-next-line:no-empty
  protected onPayloadPrepared(payload: Buffer): void {
    console.log(payload.length);
    // console.log(payload);
  }

  protected resetData(): void {
    super.resetData();
    this.payloadSize = 0;
  }

  protected onCompleteData(): void {
    const buf = Buffer.concat(this.datas);
    const { payload } = BufferUtil.extractSize(buf);
    // console.log(size);
    // console.log(payload.toString());
    this.onPayloadPrepared(payload);
  }
}
