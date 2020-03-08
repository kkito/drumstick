import * as tough from "tough-cookie";

const jar = new tough.CookieJar();
export class CookieUtil {
  public static readonly SetCookeKey = "Set-Cookie";
  public static async setCookie(
    url: string,
    headers: any
  ): Promise<tough.Cookie | null> {
    const setCookieStr = headers[this.SetCookeKey];
    if (!setCookieStr) {
      return null;
    } else {
      const cookie = tough.Cookie.parse(setCookieStr);
      if (!cookie) {
        return null;
      }
      return new Promise((resolve, reject) => {
        jar.setCookie(cookie, url, err => {
          if (err) {
            if (err.message.includes("Cookie not in this host")) {
              resolve(null);
            } else {
              reject(err);
            }
          } else {
            resolve(cookie);
          }
        });
      });
    }
  }

  public static async getCookie(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jar.getCookieString(url, (err, cookie) => {
        if (err) {
          reject(err);
        } else {
          resolve(cookie);
        }
      });
    });
  }
}
