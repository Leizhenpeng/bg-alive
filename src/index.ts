export class BgAliveManager {
  private interval: number
  private intervalId: number | null
  private runtime: typeof chrome.runtime

  constructor(interval: number = 23000) {
    const browserGlobal = globalThis as any
    this.runtime = (browserGlobal.browser?.runtime || browserGlobal.chrome?.runtime) as typeof chrome.runtime
    this.interval = interval
    this.intervalId = null
  }

  public start(): void
  public start(interval: number): void

  public start(interval?: number): void {
    if (interval !== undefined)
      this.interval = interval

    if (!this.intervalId) {
      this.executePlatformInfo()
      this.intervalId = globalThis.setInterval(() => this.executePlatformInfo(), this.interval) as unknown as number
    }
  }

  // 停止活跃
  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // 封装平台信息获取方法，增加错误处理
  private executePlatformInfo(): void {
    try {
      this.runtime.getPlatformInfo((info: chrome.runtime.PlatformInfo) => {
        // console.log('Platform info:', info);
        return info
      })
    }
    catch (error) {
      console.error('Error fetching platform info:', error as Error)
      this.stop()
    }
  }
}

export const bgAlive = new BgAliveManager()
