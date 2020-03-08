import * as http from "http";
import * as https from "https";
import * as querystring from "querystring";
import { URL } from "url";
import { CookieUtil } from "./CookieUtil";

export interface IHttpResponse {
  body: Buffer;
  status: number | undefined;
  headers: http.IncomingHttpHeaders;
}

export class HttpUtil {
  public static readonly METHOD_GET = "GET";
  public static readonly METHOD_POST = "POST";

  public static get(url: string, headers?: any): Promise<IHttpResponse> {
    if (url.match(/^https/)) {
      return this.httpsGet(url, headers);
    } else {
      return this.httpGet(url, headers);
    }
  }

  public static post(url: string, params: any): Promise<IHttpResponse> {
    if (url.match(/^https/)) {
      return this.httpsPost(url, params);
    } else {
      return this.httpPost(url, params);
    }
  }

  public static async _prepareCooke(
    url: string,
    headers?: any,
    body?: Buffer
  ): Promise<any> {
    if (!headers) {
      headers = {};
    }
    if (body) {
      headers["Content-Length"] = body.length;
    }
    const cookieStr = await CookieUtil.getCookie(url);
    if (cookieStr) {
      headers.cookie = cookieStr;
    }
    return headers;
  }

  public static request(
    url: string,
    method: string = "GET",
    headers?: any,
    body?: Buffer
  ): Promise<IHttpResponse> {
    return new Promise(async (resolve, reject) => {
      const theUrl = new URL(url);

      let schema: {
        request: (
          options: http.RequestOptions,
          callback?: (res: http.IncomingMessage) => void
        ) => http.ClientRequest;
      } = http;
      if (theUrl.protocol.startsWith("https")) {
        schema = https;
      }
      headers = await this._prepareCooke(url, headers, body);
      const client = schema.request(
        {
          port: theUrl.port,
          hostname: theUrl.hostname,
          method,
          path: theUrl.pathname + theUrl.search,
          headers
        },
        resp => {
          const data: any[] = [];

          // A chunk of data has been recieved.
          resp.on("data", chunk => {
            data.push(chunk);
          });

          // The whole response has been received. Print out the result.
          resp.on("end", async () => {
            await CookieUtil.setCookie(url, resp.headers);
            resolve({
              body: Buffer.concat(data),
              headers: resp.headers,
              status: resp.statusCode
            });
          });
        }
      );
      if (body) {
        client.write(body);
      }
      client.on("error", err => {
        reject(err);
      });
      client.end();
    });
  }

  public static httpsPost(url: string, params: any): Promise<IHttpResponse> {
    return new Promise(async (resolve, reject) => {
      const theUrl = new URL(url);

      let postData: Buffer | string;
      if (Buffer.isBuffer(params)) {
        postData = params;
      } else {
        postData = querystring.stringify(params);
      }

      const headers = await this._prepareCooke(url, {
        "Content-Length": Buffer.byteLength(postData),
        "Content-Type": "application/x-www-form-urlencoded"
      });
      const postParams = {
        headers,
        host: theUrl.host,
        method: "POST",
        path: theUrl.pathname,
        port: theUrl.port
      };
      const postReq = https
        .request(postParams, resp => {
          const data: any[] = [];

          // A chunk of data has been recieved.
          resp.on("data", chunk => {
            data.push(chunk);
          });

          // The whole response has been received. Print out the result.
          resp.on("end", async () => {
            await CookieUtil.setCookie(url, resp.headers);
            resolve({
              body: Buffer.concat(data),
              headers: resp.headers,
              status: resp.statusCode
            });
          });
        })
        .on("error", err => {
          reject(err);
        });
      postReq.write(postData);
      postReq.end();
    });
  }

  public static httpPost(url: string, params: any): Promise<IHttpResponse> {
    return new Promise(async (resolve, reject) => {
      const theUrl = new URL(url);

      let postData: Buffer | string;
      if (Buffer.isBuffer(params)) {
        postData = params;
      } else {
        postData = querystring.stringify(params);
      }

      const headers = await this._prepareCooke(url, {
        "Content-Length": Buffer.byteLength(postData),
        "Content-Type": "application/x-www-form-urlencoded"
      });
      const postParams = {
        headers,
        host: theUrl.host,
        method: "POST",
        path: theUrl.pathname,
        port: theUrl.port
      };
      const postReq = http
        .request(postParams, resp => {
          const data: any[] = [];

          // A chunk of data has been recieved.
          resp.on("data", chunk => {
            data.push(chunk);
          });

          // The whole response has been received. Print out the result.
          resp.on("end", async () => {
            await CookieUtil.setCookie(url, resp.headers);
            resolve({
              body: Buffer.concat(data),
              headers: resp.headers,
              status: resp.statusCode
            });
          });
        })
        .on("error", err => {
          reject(err);
        });
      postReq.write(postData);
      postReq.end();
    });
  }

  public static httpGet(url: string, headers?: any): Promise<IHttpResponse> {
    const theUrl = new URL(url);
    return new Promise(async (resolve, reject) => {
      headers = await this._prepareCooke(url, headers);
      http
        .get(
          {
            host: theUrl.host,
            port: theUrl.port,
            headers,
            path: `${theUrl.pathname}${theUrl.search}`
          },
          resp => {
            const data: any[] = [];

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
              data.push(chunk);
            });

            // The whole response has been received. Print out the result.
            resp.on("end", async () => {
              await CookieUtil.setCookie(url, headers);
              resolve({
                body: Buffer.concat(data),
                headers: resp.headers,
                status: resp.statusCode
              });
            });
          }
        )
        .on("error", err => {
          reject(err);
        });
    });
  }

  public static httpsGet(url: string, headers?: any): Promise<IHttpResponse> {
    const theUrl = new URL(url);
    return new Promise(async (resolve, reject) => {
      headers = await this._prepareCooke(url, headers);
      https
        .get(
          {
            host: theUrl.host,
            port: theUrl.port,
            headers,
            path: `${theUrl.pathname}${theUrl.search}`
          },
          resp => {
            const data: any[] = [];

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
              data.push(chunk);
            });

            // The whole response has been received. Print out the result.
            resp.on("end", async () => {
              await CookieUtil.setCookie(url, headers);
              resolve({
                body: Buffer.concat(data),
                headers: resp.headers,
                status: resp.statusCode
              });
            });
          }
        )
        .on("error", err => {
          reject(err);
        });
    });
  }
}
