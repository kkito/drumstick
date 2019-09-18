import { DrumstickClient } from "./libs/DrumstickClient";
import { CliOptions } from "./utils/CliOptions";

const options = CliOptions.getOptions();

const url = process.argv[2];

async function main() {
  const client = new DrumstickClient(options, options.secret);
  try {
    const result = await client.request(url);
    console.log(result.headers);
    console.log(result.body);
    client.close();
  } catch (err) {
    console.log(err);
  }
}
main();
