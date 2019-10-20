import { URL } from "url";
import { DrumstickClient } from "../../src/libs/DrumstickClient";
import { HttpUtil } from "../../src/utils/HttpUtil";

test.skip("utils", async done => {
  const result = await HttpUtil.get("https://www.baidu.com");
  // const result = await HttpUtil.get('http://www.baidu.com')
  console.log(result.body);
  console.log(Object.keys(result.headers));
  done();
});

test.skip("download by post", async done => {
  const options = { port: 4821, host: "0.0.0.0" };
  const client = new DrumstickClient(options, "testkey");
  const url = "";
  const result = await client.request(url);
  console.log(result.body);
  console.log(result.headers);
  done();
});

test.skip("url attr", async done => {
  const url = new URL("https://www.baidu.com:444/hello/word.php?wuery#wfeew");
  console.log(url.protocol);
  console.log(url.port);
  console.log(url.hostname);
  console.log(url.host);
  console.log(url.pathname);
  console.log(url.hash);
  console.log(url.searchParams);
  console.log(url.search);

  const result = await HttpUtil.request(
    "http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=worldcpu&rsv_pq=afe58617005d810b&rsv_t=57f3dijjPofSdiCfOfgdxPD%2FhJ7uoPXZm7%2F0eBw370kCG39s3XaKUPvFohQ&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=14&rsv_sug1=8&rsv_sug7=101&rsv_sug2=0&inputT=4335&rsv_sug4=5966",
    "GET"
  );
  console.log(result);
  console.log(result.body.toString());
  done();
});
