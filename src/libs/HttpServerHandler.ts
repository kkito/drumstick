import { HttpUtil, IHttpResponse } from "../utils/HttpUtil";
import { LogUtil } from "../utils/LogUtil";
import { RC4PayloadServerHandler } from "./RC4PayloadServerHandler";

export class HttpServerHandler extends RC4PayloadServerHandler {
  protected onDecodeData(data: Buffer): void {
    const requestOptions = JSON.parse(data.toString());
    const url = requestOptions.url;
    const method = requestOptions.method || HttpUtil.METHOD_GET;
    const params = requestOptions.params || {};

    LogUtil.info(`begin request url: ${url}`);
    let response: Promise<IHttpResponse>;
    // tslint:disable-next-line:prefer-conditional-expression
    if (method === HttpUtil.METHOD_POST) {
      response = HttpUtil.post(url, params);
    } else {
      response = HttpUtil.get(url);
    }
    response
      .then(result => {
        this.send(
          JSON.stringify({
            body: result.body.toString("base64"),
            headers: result.headers,
            status: result.status
          })
        );
        LogUtil.info(`finished request url: ${url}`);
        this.close();
      })
      .catch(() => {
        this.close();
      });
  }
}
