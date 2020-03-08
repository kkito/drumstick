import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import * as tough from "tough-cookie";
import { LogUtil } from "./LogUtil";

export const jarCacheFile = "/tmp/drum.cookie.cache";

export class CookieUtil {
  public static readonly SetCookeKey = "Set-Cookie";
  public static async setCookie(url: string, headers: any): Promise<boolean> {
    const setCookieStr =
      headers[this.SetCookeKey] || headers[this.SetCookeKey.toLowerCase()];
    if (!setCookieStr) {
      return false;
    } else {
      if (Array.isArray(setCookieStr)) {
        for (const cookieStr of setCookieStr) {
          await this._setSingleCookieStr(url, cookieStr);
        }
      } else {
        await this._setSingleCookieStr(url, setCookieStr);
      }
      this.serializeJar();
      return true;
    }
  }

  public static async _setSingleCookieStr(
    url: string,
    cookieStr: string
  ): Promise<tough.Cookie | null> {
    const cookie = tough.Cookie.parse(cookieStr);
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

  // 序列化反序列化, 和初始化
  public static initJar(): tough.CookieJar {
    try {
      if (existsSync(jarCacheFile)) {
        return tough.CookieJar.deserializeSync(
          readFileSync(jarCacheFile).toString()
        );
      }
    } catch (e) {
      LogUtil.error(e);
    }
    return new tough.CookieJar();
  }

  public static serializeJar() {
    try {
      if (jar) {
        writeFileSync(jarCacheFile, JSON.stringify(jar.toJSON()));
      }
    } catch (e) {
      LogUtil.error(e);
    }
  }

  // 脚本可以初始化cookie
  // TODO cli下可以调整
  public static async updateJar(url: string, setCookieStr: string) {
    await this._setSingleCookieStr(url, setCookieStr);
    this.serializeJar();
  }

  public static clearJar(): tough.CookieJar {
    if (existsSync(jarCacheFile)) {
      unlinkSync(jarCacheFile);
    }
    jar = this.initJar();
    return jar;
  }
}

export let jar = CookieUtil.initJar();
