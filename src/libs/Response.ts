import * as http from "http";
export interface IDSResponse {
  body: string | Buffer;
  headers: http.IncomingHttpHeaders;
}

export class DrumstickResponse implements IDSResponse {
  public static readonly ENCODING_BINARY = "binary";
  public static readonly ENCODING_UTF8 = "utf8";
  public static readonly ENCODING_BASE64 = "base64";

  public static readonly CONTENT_TYPE_BINARY = "binary";
  public static readonly CONTENT_TYPE_SPLIT = "/";

  public body: string | Buffer;
  public headers: http.IncomingHttpHeaders;
  public readonly status: number | undefined;

  constructor(
    status: number | undefined,
    body: string | Buffer,
    headers: http.IncomingHttpHeaders
  ) {
    this.status = status;
    this.body = body;
    this.headers = headers;
  }

  public is_binary_content_type(): boolean {
    return (
      this.get_content_type_category() === DrumstickResponse.CONTENT_TYPE_BINARY
    );
  }

  protected get_content_type_category(): string | null {
    if (this.headers["content-type"]) {
      return this.headers["content-type"].split(
        DrumstickResponse.CONTENT_TYPE_SPLIT
      )[0];
    } else {
      return null;
    }
  }
}
