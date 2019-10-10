import * as net from "net";

export interface IClient {
  connect(): Promise<boolean>;
  write(content: Buffer | string): Promise<boolean>;
  // receive(str: string): Promise<boolean>
  // addListener(event: "data", listener: (data: Buffer) => void): this;
}

export class BasicClient implements IClient {
  protected listenOption: net.NetConnectOpts;
  protected socket?: net.Socket;
  protected datas: Buffer[];
  protected dataSize = 0;
  protected isCompleted = false;
  protected completedTimer?: NodeJS.Timeout;
  protected timeoutMillSeconds = 10000;
  protected onErrorHandler?: (err: string | Error) => void;

  constructor(options: net.NetConnectOpts) {
    this.listenOption = options;
    this.datas = [];
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket = net.connect(this.listenOption, () => {
        return resolve(true);
      });

      this.socket.on("error", err => {
        console.log("on Error");
        reject(err);
        this.triggerError(err);
      });
      this.socket.on("end", () => {
        // server end client
        console.log("ended");
        reject("ended");
        this.triggerError("ended");
      });
      this.socket.on("data", data => {
        // console.log("on Data");
        process.stdout.write(".");
        this.setCompleteTimer(reject);
        this.datas.push(data);
        this.dataSize += data.length;
        this.onDataReceive(data);
      });

      this.socket.on("connect", () => {
        console.log("connected");
      });
      console.log("settimout");
      this.socket.setTimeout(this.timeoutMillSeconds);
      this.setCompleteTimer(reject);
    });
  }

  public isConnected() {
    return !!this.socket;
  }

  public enSureConnected() {
    if (!this.isConnected()) {
      throw new Error("client is not connected!");
    }
  }

  public write(content: string | Buffer): Promise<boolean> {
    this.enSureConnected();
    return new Promise(resolve => {
      if (this.socket == null) {
        throw new Error("client is not connected!");
      }
      this.socket.write(content, undefined, () => {
        resolve(true);
      });
    });
  }

  public close(): void {
    if (this.completedTimer) {
      clearTimeout(this.completedTimer);
      this.completedTimer = undefined;
    }
    if (this.socket) {
      this.socket.end();
      this.socket.destroy();
      this.socket = undefined;
    }
  }

  public setTimeoutMillSeconds(seconds: number): void {
    this.timeoutMillSeconds = seconds;
  }

  protected setCompleteTimer(reject: (p: any) => void): void {
    if (this.completedTimer) {
      clearTimeout(this.completedTimer);
    }
    this.completedTimer = setTimeout(() => {
      if (!this.isCompleted) {
        console.log("timeout!");
        this.close();
        console.log("timeout close!");
        reject("timeout");
        this.triggerError("timeout");
        console.log("timeout reject!");
      } else {
        console.log("finished completed!");
      }
    }, this.timeoutMillSeconds);
  }
  protected resetData(): void {
    this.dataSize = 0;
    this.datas = [];
  }

  protected triggerError(err: string | Error) {
    this.close();
    if (this.onErrorHandler) {
      this.onErrorHandler(err);
    }
  }

  // tslint:disable-next-line:variable-name
  protected onDataReceive(_data: Buffer): void {} // tslint:disable-next-line:no-empty

  // public receive(str: string): Promise<boolean> {
  //   throw new Error("Method not implemented.");
  // }
  // public addListener(event: "data", listener: (data: Buffer) => void): this {
  //   throw new Error("Method not implemented.");
  // }
}
