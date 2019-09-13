import * as crypto from "crypto";

export class RC4Util {
  public static readonly CRYPTO_NAME = "rc4";

  /**
   * rc4 加密
   * @param content 需要加密内容
   * @param secretKey 密钥
   */
  public static encode(content: string, secretKey: string): Buffer {
    const buf = Buffer.from(content);
    return this.encodeBuffer(buf, secretKey);
  }

  public static encodeBuffer(content: Buffer, secretKey: string): Buffer {
    const cipher = crypto.createCipher(this.CRYPTO_NAME, secretKey);
    const updateBuf = cipher.update(content);
    const finalBuf = cipher.final();
    return Buffer.concat([updateBuf, finalBuf]);
  }

  /**
   * 对加密过的buffer进行解密
   * @param cryptoBuf 加密过的buffer
   * @param secretKey 密钥
   */
  public static decode(cryptoBuf: Buffer, secretKey: string): Buffer {
    const decipher = crypto.createDecipher(this.CRYPTO_NAME, secretKey);
    const updateBuf = decipher.update(cryptoBuf);
    const finalBuf = decipher.final();
    return Buffer.concat([updateBuf, finalBuf]);
  }
}
