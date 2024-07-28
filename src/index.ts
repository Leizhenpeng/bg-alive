/* eslint-disable no-console */
export class BgAliveManager {
  private interval: number
  private intervalId: number | null
  private runtime: typeof chrome.runtime
  private isDebug: boolean

  constructor(interval: number = 23000, isDebug: boolean = false) {
    const browserGlobal = globalThis as any
    this.runtime = (browserGlobal.browser?.runtime || browserGlobal.chrome?.runtime) as typeof chrome.runtime
    this.interval = interval
    this.intervalId = null
    this.isDebug = isDebug
  }

  public start(interval?: number): void {
    if (interval !== undefined)
      this.interval = interval

    if (this.intervalId === null) {
      this.executePlatformInfo()
      this.intervalId = globalThis.setInterval(() => this.executePlatformInfo(), this.interval) as unknown as number
      this.debugLog('BgAliveManager started')
    }
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.debugLog('BgAliveManager stopped')
    }
  }

  private debugLog(...msg: any[]): void {
    if (this.isDebug)
      console.log(...msg)
  }

  private executePlatformInfo(): void {
    try {
      this.runtime.getPlatformInfo((info: chrome.runtime.PlatformInfo) => {
        this.debugLog('Platform info:', info)
      })
    }
    catch (error) {
      console.error('Error fetching platform info:', error)
      this.stop()
    }
  }
}

export const bgAlive = new BgAliveManager()
