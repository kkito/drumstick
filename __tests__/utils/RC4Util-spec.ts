import { RC4Util } from "../../src/utils/RC4Util";

test("string crypto", () => {
  const msg = "test message";
  const key = "123";
  const cryptoBuf = RC4Util.encode(msg, key);
  const result = RC4Util.decode(cryptoBuf, key);
  expect(result.toString()).toEqual(msg);

  const result2 = RC4Util.decode(cryptoBuf, "other key");
  expect(result2.toString()).not.toEqual(msg);
});
