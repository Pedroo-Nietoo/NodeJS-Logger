type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'info' | 'fatal';

interface LoggerConfig {
 format?: 'text' | 'json';
 timestamp?: boolean;
 timeDelta?: boolean;
 time?: boolean;
 date?: boolean;
}

class LoggerService {
 private config: Required<LoggerConfig>;
 private appName: string;
 private lastTimestamp: number;

 constructor(appName = 'Logger', config: LoggerConfig = {}) {
  this.appName = appName;
  this.lastTimestamp = Date.now();
  this.config = {
   format: config.format || 'text',
   timestamp: config.timestamp ?? true,
   timeDelta: config.timeDelta ?? false,
   time: config.time ?? true,
   date: config.date ?? true,
  };
 }

 private getTimestamp(): string {
  const now = new Date();
  if (!this.config.timestamp) return '';
  if (!this.config.date && !this.config.time) return '';

  const options: Intl.DateTimeFormatOptions = {
   hour12: true,
  };

  if (this.config.date) {
   options.day = '2-digit';
   options.month = '2-digit';
   options.year = 'numeric';
  }
  if (this.config.time) {
   options.hour = '2-digit';
   options.minute = '2-digit';
   options.second = '2-digit';
  }

  return now.toLocaleString('pt-BR', options);
 }

 private formatDelta(): string {
  const now = Date.now();
  const delta = now - this.lastTimestamp;
  this.lastTimestamp = now;
  return `+${delta}ms`;
 }

 private async colorByLevel(level: LogLevel, msg: string) {
  const chalk = (await import('chalk')).default;
  const colors = {
   log: chalk.green,
   error: chalk.red,
   warn: chalk.yellow,
   debug: chalk.magenta,
   verbose: chalk.white,
   info: chalk.blue,
   fatal: chalk.white.bold,
  };
  return colors[level](msg);
 }

 private async printMessage(level: LogLevel, message: string, context: string) {
  const pid = process.pid;
  const timestamp = this.getTimestamp();
  const delta = this.config.timeDelta ? this.formatDelta() : '';

  if (this.config.format === 'json') {
   const log = {
    app: this.appName,
    pid,
    timestamp,
    level,
    context,
    message,
    delta: delta || undefined,
   };
   console.log(JSON.stringify(log));
   return;
  }

  const chalk = (await import('chalk')).default;

  const parts = [
   await this.colorByLevel(level, `[${this.appName}]`),
   await this.colorByLevel(level, `${pid}`),
   chalk.white(timestamp),
   await this.colorByLevel(level, level.toUpperCase()),
   chalk.yellow(`[${context}]`),
   await this.colorByLevel(level, message),
   delta ? chalk.yellow(delta) : '',
  ];

  console.log(parts.filter(Boolean).join(' '));
 }

 log(message: string, context = 'Server') {
  this.printMessage('log', message, context);
 }

 error(message: string, context = 'Server') {
  this.printMessage('error', message, context);
 }

 warn(message: string, context = 'Server') {
  this.printMessage('warn', message, context);
 }

 debug(message: string, context = 'Server') {
  this.printMessage('debug', message, context);
 }

 verbose(message: string, context = 'Server') {
  this.printMessage('verbose', message, context);
 }

 info(message: string, context = 'Server') {
  this.printMessage('info', message, context);
 }

 fatal(message: string, context = 'Server') {
  this.printMessage('fatal', message, context);
 }
}
