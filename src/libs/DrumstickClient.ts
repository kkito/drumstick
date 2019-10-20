import * as iconv from "iconv-lite";
import { RC4PayloadClient } from "./RC4PayloadClient";
import { DrumstickResponse, IDSResponse } from "./Response";

export interface IDrumstickRequestOptions {
  retry?: number;
  body?: any;
  method?: string;
  timeout?: number; // in millseconds
}

export class DrumstickClient extends RC4PayloadClient {
  protected onDataHandler?: (data: Buffer) => void;

  public async ensureRequestV2(
    url: string,
    method = "GET",
    headers: any = {},
    body?: Buffer,
    requestOptions?: IDrumstickRequestOptions
  ): Promise<IDSResponse> {
    if (!requestOptions) {
      requestOptions = {};
    }
    const retryTimes = requestOptions.retry || 6;

    // set timeout in millseconds
    if (requestOptions.timeout) {
      this.setTimeoutMillSeconds(requestOptions.timeout);
    }

    for (let i = 0; i < retryTimes; i++) {
      try {
        const result = await this.requestV2(url, method, headers, body);
        return result;
      } catch (err) {
        // TODO err const
        if (
          err !== "timeout" &&
          err !== "This socket has been ended by the other party"
        ) {
          this.close();
          throw new Error(err);
        } else {
          this.resetData();
        }
      }
    }
    this.close();
    throw new Error("timeout for retry");
  }

  public async ensureRequest(
    url: string,
    headers: any = {},
    encoding = DrumstickResponse.ENCODING_BINARY,
    requestOptions: IDrumstickRequestOptions
  ): Promise<IDSResponse> {
    const retryTimes = requestOptions.retry || 6;

    // set timeout in millseconds
    if (requestOptions.timeout) {
      this.setTimeoutMillSeconds(requestOptions.timeout);
    }

    for (let i = 0; i < retryTimes; i++) {
      try {
        let requestBody: any = {};
        if (requestOptions.body) {
          if (Buffer.isBuffer(requestOptions.body)) {
            requestBody = requestOptions.body.toString("base64");
          } else {
            requestBody = requestOptions.body;
          }
        }
        const result = await this.request(url, headers, encoding, requestBody);
        return result;
      } catch (err) {
        // TODO err const
        if (
          err !== "timeout" &&
          err !== "This socket has been ended by the other party"
        ) {
          this.close();
          throw new Error(err);
        } else {
          this.resetData();
        }
      }
    }
    this.close();
    throw new Error("timeout for retry");
  }

  public async request(
    url: string,
    headers: any = {},
    encoding = DrumstickResponse.ENCODING_UTF8,
    httpBody?: any // 传入buffer直接传过去，非buffer 会 buildQueryString
  ): Promise<IDSResponse> {
    this.resetData();
    const params: any = { url, headers };
    if (httpBody) {
      params.params = httpBody;
    }
    if (!this.isConnected()) {
      await this.connect();
    }
    return new Promise((resolve, reject) => {
      this.onErrorHandler = (err: string | Error) => {
        console.log("onErrorHandler!");
        reject(err);
      };
      this.onDataHandler = data => {
        const result = JSON.parse(data.toString());
        let body: string | Buffer = Buffer.from(
          result.body,
          DrumstickResponse.ENCODING_BASE64
        );
        // let body: string | Buffer = result.body.toString('base64')
        // tslint:disable-next-line:prefer-conditional-expression
        if (encoding === DrumstickResponse.ENCODING_BINARY) {
          body = body;
        } else if (encoding !== DrumstickResponse.ENCODING_UTF8) {
          body = iconv.decode(body, encoding);
        } else {
          body = body.toString();
        }
        resolve({
          body,
          headers: result.headers,
          status: result.status
        });
      };
      this.send(JSON.stringify(params));
    });
  }

  public async requestV2(
    url: string,
    method = "GET",
    headers: any = {},
    body?: Buffer
  ): Promise<IDSResponse> {
    this.resetData();
    const params: any = { url, headers, version: 2, method };
    if (body) {
      params.body = body.toString("base64");
    }
    if (!this.isConnected()) {
      await this.connect();
    }
    return new Promise((resolve, reject) => {
      this.onErrorHandler = (err: string | Error) => {
        console.log("onErrorHandler!");
        reject(err);
      };
      this.onDataHandler = data => {
        const result = JSON.parse(data.toString());
        const resBody: Buffer = Buffer.from(
          result.body,
          DrumstickResponse.ENCODING_BASE64
        );
        resolve({
          body: resBody,
          headers: result.headers,
          status: result.status
        });
      };
      this.send(JSON.stringify(params));
    });
  }

  protected onDecodeData(data: any): void {
    this.resetData();
    console.log("on decode data");
    if (this.onDataHandler) {
      this.onDataHandler(data);
    }
  }
}
