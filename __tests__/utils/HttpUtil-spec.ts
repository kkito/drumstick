import { DrumstickClient } from '../../src/libs/DrumstickClient';
import { HttpUtil } from '../../src/utils/HttpUtil';

test.skip('utils', async done => {
  const result = await HttpUtil.get('https://www.baidu.com');
  // const result = await HttpUtil.get('http://www.baidu.com')
  console.log(result.body);
  console.log(Object.keys(result.headers));
  done();
});

test.skip('download by post', async done => {
  const options = { port: 4821, host: '0.0.0.0' };
  const client = new DrumstickClient(options, 'testkey');
  const url = '';
  const result = await client.request(url);
  console.log(result.body);
  console.log(result.headers);
  done();
});
