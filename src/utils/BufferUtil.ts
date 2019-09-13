export class BufferUtil {
  /**
   * 在给定的buffer上加上长度信息，前面4个bit，用int32BE
   * @param buf 给定的buffer
   */
  public static sizeWithBuffer(buf: Buffer): Buffer {
    const size = buf.length + 4;
    const sizeBuf = Buffer.alloc(4);
    sizeBuf.writeInt32BE(size, 0);
    return Buffer.concat([sizeBuf, buf]);
  }

  /**
   * 把带有内容长度的buffer内容
   * @param sizeBuffer 带有长度的buffer内容
   */
  public static extractSize(
    sizeBuffer: Buffer
  ): { size: number; payload: Buffer } {
    if (sizeBuffer.length <= 4) {
      throw new Error("invalid size of givien buffer");
    }
    const size = sizeBuffer.readInt32BE(0);
    const payload = sizeBuffer.slice(4);
    return { size, payload };
  }
}
