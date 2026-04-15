export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  error?: Error;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}

class ConsoleLogger implements Logger {
  private minLevel: LogLevel;
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(minLevel: LogLevel = 'info') {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.minLevel];
  }

  private formatEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const contextStr = entry.context
      ? ` ${JSON.stringify(entry.context)}`
      : '';
    const errorStr = entry.error ? `\n${entry.error.stack}` : '';
    return `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}`;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    const entry: LogEntry = {
      level: 'debug',
      message,
      context,
      timestamp: new Date()
    };
    console.debug(this.formatEntry(entry));
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    const entry: LogEntry = {
      level: 'info',
      message,
      context,
      timestamp: new Date()
    };
    console.info(this.formatEntry(entry));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    const entry: LogEntry = {
      level: 'warn',
      message,
      context,
      timestamp: new Date()
    };
    console.warn(this.formatEntry(entry));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;
    const entry: LogEntry = {
      level: 'error',
      message,
      context,
      timestamp: new Date(),
      error
    };
    console.error(this.formatEntry(entry));
  }
}

export const logger = new ConsoleLogger(process.env.LOG_LEVEL as LogLevel || 'info');

export function createLogger(minLevel: LogLevel): Logger {
  return new ConsoleLogger(minLevel);
}