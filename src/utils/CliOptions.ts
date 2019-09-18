export interface IDrumstickCliOptions {
  check_tls: string;
  host: string;
  maxConnections: number;
  port: number;
  secret: string;
  timeout: number;
}
const defaultOptions = {
  check_tls: "0", // 0 for disable , 1 for enable
  host: "0.0.0.0",
  maxConnections: 100,
  port: 4812,
  secret: "testkey", // default secretkey
  timeout: 1000 * 60 * 2 // timeout 2 minutes
};

export class CliOptions {
  public static getOptions(): IDrumstickCliOptions {
    process.argv.forEach(val => {
      const paramSplit = val.split("=");
      if (paramSplit.length > 1) {
        const attr = paramSplit[0];
        if (Object.keys(defaultOptions).includes(attr)) {
          const attrValue = val.slice(attr.length + 1);
          const myo: any = defaultOptions;
          // tslint:disable-next-line:prefer-conditional-expression
          if (myo[attr] instanceof Number) {
            myo[attr] = parseInt(attrValue, 10);
          } else {
            myo[attr] = attrValue;
          }
        }
      }
    });
    return defaultOptions;
  }
}
