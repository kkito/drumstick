import * as tough from "tough-cookie";
import { CookieUtil, jar } from "../../src/utils/CookieUtil";
import { HttpUtil } from "../../src/utils/HttpUtil";

function buildCookieStr(
  key = "uid",
  value = "test",
  expireDate: Date = new Date(),
  domain = ".test.com"
) {
  return `${key}=${value}; expires=${expireDate.toISOString()}; path=/; domain=${domain}`;
}
const setCookieStr = buildCookieStr();
// const setCookieStr = '__cfduid=dd4; expires=Mon, 06-Apr-88 23:21:37 GMT; path=/; domain=.test.com'
test("usage", () => {
  const result = tough.Cookie.parse(setCookieStr);
  if (result) {
    expect(result.value).not.toBeNull();
    expect(result.key).not.toBeNull();
    expect(result.validate()).toBeTruthy();
  }
});

test("getCookie And setCookie", async done => {
  const headers: any = {};
  headers[CookieUtil.SetCookeKey] = setCookieStr;
  let url = "http://www.baidu.com/test";
  await CookieUtil.setCookie(url, headers);
  let result = await CookieUtil.getCookie(url);
  expect(result).toBe("");

  url = "http://www.test.com/test";
  await CookieUtil.setCookie(url, headers);
  result = await CookieUtil.getCookie(url);
  expect(result).toBe("uid=test");

  headers[CookieUtil.SetCookeKey] = buildCookieStr("uid2");
  await CookieUtil.setCookie(url, headers);
  result = await CookieUtil.getCookie(url);
  expect(result).toBe("uid=test; uid2=test");
  const newJar = tough.CookieJar.deserializeSync(JSON.stringify(jar.toJSON()));
  expect(JSON.stringify(jar.toJSON())).toEqual(JSON.stringify(newJar.toJSON()));

  done();
});

test.skip("正式的请求查看cookie", async done => {
  const res = await HttpUtil.request("http://www.baidu.com");
  console.log(res.body);
  const cookie = await CookieUtil.getCookie("http://www.baidu.com/test");
  console.log(cookie);
  await HttpUtil.request("http://www.baidu.com");
  done();
});
