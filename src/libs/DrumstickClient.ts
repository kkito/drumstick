import * as iconv from "iconv-lite";
import { RC4PayloadClient } from "./RC4PayloadClient";
import { DrumstickResponse, IDSResponse } from "./Response";

export interface IDrumstickRequestOptions {
  retry?: number;
}

export class DrumstickClient extends RC4PayloadClient {
  protected onDataHandler?: (data: Buffer) => void;

  public async ensureRequest(
    url: string,
    headers: any = {},
    encoding = DrumstickResponse.ENCODING_BINARY,
    requestOptions: IDrumstickRequestOptions
  ): Promise<IDSResponse> {
    const retryTimes = requestOptions.retry || 6;
    for (let i = 0; i < retryTimes; i++) {
      try {
        const result = await this.request(url, headers, encoding);
        return result;
      } catch (err) {
        // TODO err const
        if (
          err !== "timeout" ||
          err !== "This socket has been ended by the other party"
        ) {
          this.close();
          throw new Error(err);
        }
      }
    }
    this.close();
    throw new Error("timeout for retry");
  }

  public async request(
    url: string,
    headers: any = {},
    encoding = DrumstickResponse.ENCODING_UTF8
  ): Promise<IDSResponse> {
    const params = { url, headers };
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

  protected onDecodeData(data: any): void {
    this.resetData();
    console.log("on decode data");
    if (this.onDataHandler) {
      this.onDataHandler(data);
    }
  }
}
