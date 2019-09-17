import { HttpUtil, IHttpResponse } from "../utils/HttpUtil";
import { LogUtil } from "../utils/LogUtil";
import { RC4PayloadServerHandler } from "./RC4PayloadServerHandler";

export class HttpServerHandler extends RC4PayloadServerHandler {
  protected pendingRequestUrls: string[] = [];
  protected pendingResponses: { [key: string]: string } = {};

  protected onDecodeData(data: Buffer): void {
    const requestOptions = JSON.parse(data.toString());
    const url = requestOptions.url;
    this.pendingRequestUrls.push(url);
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
        const sendData = JSON.stringify({
          body: result.body.toString("base64"),
          headers: result.headers,
          status: result.status
        });
        this.pendingResponses[url] = sendData;
        this.sendReponses();
        // this.close();
      })
      .catch(() => {
        // this.close();
      });
  }

  protected sendReponses(urls: string[] = []): string[] {
    const nextUrl = this.pendingRequestUrls[0];
    if (nextUrl) {
      const sendData = this.pendingResponses[nextUrl];
      if (sendData) {
        this.pendingRequestUrls.shift();
        delete this.pendingResponses[nextUrl];
        this.send(sendData);
        LogUtil.info(`finished request url: ${nextUrl}`);
        urls.push(nextUrl);
        return this.sendReponses(urls);
      }
    }
    return urls;
  }
}
