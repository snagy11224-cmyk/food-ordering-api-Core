class Logger {
  private static instance: Logger;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    Logger.instance = this;
  }

  log(
    level: string,
    message: string,
    metadata: Record<string, unknown> = {}
  ): void {
    const logObject = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    console.log(JSON.stringify(logObject));
  }

  info(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("info", message, metadata);
  }

  debug(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("debug", message, metadata);
  }

  error(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("error", message, metadata);
  }

  warn(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("warn", message, metadata);
  }
}

const logger = new Logger();

export default logger;