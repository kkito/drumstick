#!/usr/bin/env node

import { DrumstickClient } from "./libs/DrumstickClient";
import { CliOptions } from "./utils/CliOptions";

const options = CliOptions.getOptions();

export const url = process.argv[2];

async function main() {
  const client = new DrumstickClient(options, options.secret);
  try {
    // const result = await client.ensureRequest(url, {}, "utf-8", { retry: 6 });
    const result = await client.ensureRequestV2(url);
    // const result = await client.requestV2('http://www.baidu.com');
    console.log(result.body.toString());
    client.close();
  } catch (err) {
    console.log(err);
  }
}
main();
