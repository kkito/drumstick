#!/usr/bin/env node

import * as net from "net";
import { HttpServerHandler } from "./libs/HttpServerHandler";
import { CliOptions } from "./utils/CliOptions";

const defaultOptions = CliOptions.getOptions();

const server = net.createServer(client => {
  // https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback
  client.setTimeout(defaultOptions.timeout); // 默认timeout时间
  // tslint:disable-next-line:no-unused-expression
  new HttpServerHandler(client, defaultOptions.secret);
});

server.maxConnections = defaultOptions.maxConnections;

// no-check-certificate, TODO make it option for start server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = defaultOptions.check_tls;

server.listen(defaultOptions.port, defaultOptions.host, () => {
  console.log("=========server configs========");
  console.log(defaultOptions);
  console.log("=========server configs========");
  console.log("server started!");
  console.log(`listen port ${defaultOptions.port}`);
});
