export class LogUtil {
  public static debug(content: any) {
    this._log("debug", content);
  }
  public static info(content: any) {
    this._log("info", content);
  }
  public static error(content: any) {
    this._log("error", content);
  }
  public static fatal(content: any) {
    this._log("fatal", content);
  }

  public static _log(level: string, content: any): void {
    console.log(`${new Date().toLocaleString()} - ${level}: ${content}`);
  }
}
