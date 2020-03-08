#!/usr/bin/env node

import { CookieUtil } from "./utils/CookieUtil";

const url = process.argv[2];
const cookieStr = process.argv[3];

async function main() {
  CookieUtil.updateJar(url, cookieStr);
}
main();
