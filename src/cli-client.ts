#!/usr/bin/env node

import { DrumstickClient } from "./libs/DrumstickClient";
import { CliOptions } from "./utils/CliOptions";

const options = CliOptions.getOptions();

const url = process.argv[2];

async function main() {
  const client = new DrumstickClient(options, options.secret);
  try {
    const result = await client.ensureRequest(url, {}, "utf-8", { retry: 6 });
    console.log(result.body);
    client.close();
  } catch (err) {
    console.log(err);
  }
}
main();
