import * as http from "http";
import * as https from "https";
import * as querystring from "querystring";
import { URL } from "url";

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
  public static httpsPost(url: string, params: any): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      const theUrl = new URL(url);

      let postData: Buffer | string;
      if (Buffer.isBuffer(params)) {
        postData = params;
      } else {
        postData = querystring.stringify(params);
      }

      const postParams = {
        headers: {
          "Content-Length": Buffer.byteLength(postData),
          "Content-Type": "application/x-www-form-urlencoded"
        },
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
          resp.on("end", () => {
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
    return new Promise((resolve, reject) => {
      const theUrl = new URL(url);

      let postData: Buffer | string;
      if (Buffer.isBuffer(params)) {
        postData = params;
      } else {
        postData = querystring.stringify(params);
      }

      const postParams = {
        headers: {
          "Content-Length": Buffer.byteLength(postData),
          "Content-Type": "application/x-www-form-urlencoded"
        },
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
          resp.on("end", () => {
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
    return new Promise((resolve, reject) => {
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
            resp.on("end", () => {
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
    return new Promise((resolve, reject) => {
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
            resp.on("end", () => {
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
