import * as crypto from "crypto";
import { BufferUtil } from "../../src/utils/BufferUtil";

test("size append and extract", () => {
  const msg = "i am test msg";
  const buf = Buffer.from(msg);

  const sizeBuffer = BufferUtil.sizeWithBuffer(buf);
  const sizeAndBuffer = BufferUtil.extractSize(sizeBuffer);
  expect(sizeAndBuffer.size).toEqual(buf.length + 4);
  expect(sizeAndBuffer.payload.toString()).toEqual(msg);
});

test.skip("test", () => {
  console.log(BufferUtil);
  const a = 1;
  expect(a).toEqual(1);
  const buf = Buffer.alloc(10);
  // buf.writeInt16BE(256 * 256 ,0)
  buf.writeInt32BE(256 * 256 + 4, 0);
  // buf.writeInt32BE(-4, 0)
  // buf.writeFloatBE(3,0)
  const size = buf.readInt32BE(0);
  // buf.slice(4).toString()
  console.log(size);
  // buf.writeInt32LE(256* 256  + 4, 0)
  console.log(buf.toJSON());
});

test.skip("rc4", () => {
  const decipher = crypto.createDecipher("rc4", "MY SECRET KEY");
  const text = "HELLO";
  const buf = Buffer.from(text);
  console.log(buf.toJSON());
  const decrypted = decipher.update(buf);
  decipher.final();
  console.log(decrypted.toJSON());
  console.log(decrypted);
});

test.skip("generate aes", () => {
  const algorithm = "aes-192-cbc";
  const password = "Password used to generate key";
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(password, "salt", 24);
  // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const iv2 = Buffer.alloc(16, 0); // Initialization vector.
  const decipher = crypto.createDecipheriv(algorithm, key, iv2);

  const buf = Buffer.from("some clear text data");
  // let encrypted = cipher.update("some clear text data", "hex", "hex");
  const encrypted = cipher.update(buf);
  const out1 = cipher.final();
  console.log(buf.toString());
  console.log("=============================");
  // console.log(encrypted.toJSON()); console.log(encrypted.toJSON());
  // sole.log(encrypted.length);
  console.log(encrypted.length);
  console.log(encrypted.toJSON());
  console.log(out1.length);
  console.log(out1.toJSON());
  const outBuf = Buffer.concat([encrypted, out1]);
  console.log(outBuf.length);
  const out2 = decipher.update(outBuf);
  const out3 = decipher.final();
  console.log(out2.length);
  console.log(out3.length);
  const allBuf = Buffer.concat([out2, out3]);
  console.log(allBuf.toString());
  // const out3 = decipher.final();
  // const out3 = 'ssss'
  // // console.log(out2.toJSON());
  // console.log(out2.length);
  // console.log(out3.length);
  // console.log(out3.length);
  // console.log(out2.ipher.update(encrypted);
  // console.log(out3.toJSON());
  // console.log(out3.toString());
  // console.log("=============================")
});

test.skip("aes", () => {
  const algorithm = "aes-192-cbc";
  const password = "Password used to generate key";
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(password, "salt", 24);
  // The IV is usually passed along with the ciphertext.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // Encrypted using same algorithm, key and iv.
  const encrypted =
    "e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa";
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(decrypted);
});
