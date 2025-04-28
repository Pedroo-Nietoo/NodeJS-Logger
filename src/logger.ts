type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'info' | 'fatal';

class LoggerService {
 private appName: string;
 private lastTimestamp: number;
 private showDelta: boolean;

 constructor(appName = 'Logger', showDelta = false) {
  this.appName = appName;
  this.lastTimestamp = Date.now();
  this.showDelta = showDelta;
 }

 private getTimestamp(): string {
  const now = new Date();
  return now.toLocaleString('pt-BR', {
   day: '2-digit',
   month: '2-digit',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
   hour12: true,
  });
 }

 private async colorByLevel(level: LogLevel, message: string): Promise<string> {
  const chalk = (await import('chalk')).default;

  switch (level) {
   case 'error': return chalk.red(message);
   case 'warn': return chalk.yellow(message);
   case 'debug': return chalk.magenta(message);
   case 'verbose': return chalk.white(message);
   case 'info': return chalk.blue(message);
   case 'fatal': return chalk.white.bold(message);
   default: return chalk.green(message);
  }
 }

 private formatDelta(): string {
  const now = Date.now();
  const delta = now - this.lastTimestamp;
  this.lastTimestamp = now;
  return `+${delta}ms`;
 }

 log(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('log', message, context, showDelta);
 }

 error(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('error', message, context, showDelta);
 }

 warn(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('warn', message, context, showDelta);
 }

 debug(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('debug', message, context, showDelta);
 }

 verbose(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('verbose', message, context, showDelta);
 }

 info(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('info', message, context, showDelta);
 }

 fatal(message: string, context = 'Server', showDelta?: boolean) {
  this.printMessage('fatal', message, context, showDelta);
 }

 private async printMessage(level: LogLevel, message: string, context: string, showDelta = this.showDelta) {
  const chalk = (await import('chalk')).default;

  const pid = process.pid;
  const timestamp = this.getTimestamp();
  const coloredLevel = await this.colorByLevel(level, level.toUpperCase());
  const coloredMessage = await this.colorByLevel(level, message);
  const delta = showDelta ? this.formatDelta() : '';

  const coloredAppName = await this.colorByLevel(level, `[${this.appName}]`);
  const coloredPid = await this.colorByLevel(level, `${pid}`);
  const coloredTimestamp = chalk.white(timestamp);
  const coloredContext = chalk.yellow(`[${context}]`);
  const coloredDelta = delta ? chalk.yellow(delta) : '';

  const formatted = `${coloredAppName} ${coloredPid} - ${coloredTimestamp} ${coloredLevel} ${coloredContext} ${coloredMessage} ${coloredDelta}`.trim();

  console.log(formatted);
 }
}

const logger = new LoggerService();

export { logger };
