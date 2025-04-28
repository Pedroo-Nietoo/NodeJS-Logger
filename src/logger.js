class LoggerService {
  constructor(appName = 'App', showDelta = false) {
    this.appName = appName;
    this.lastTimestamp = Date.now();
    this.showDelta = showDelta;
  }

  getTimestamp() {
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

  async colorByLevel(level, message) {
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

  formatDelta() {
    const now = Date.now();
    const delta = now - this.lastTimestamp;
    this.lastTimestamp = now;
    return `+${delta}ms`;
  }

  log(message, context = 'Server') {
    this.printMessage('log', message, context);
  }

  error(message, context = 'Server') {
    this.printMessage('error', message, context);
  }

  warn(message, context = 'Server') {
    this.printMessage('warn', message, context);
  }

  debug(message, context = 'Server') {
    this.printMessage('debug', message, context);
  }

  verbose(message, context = 'Server') {
    this.printMessage('verbose', message, context);
  }

  info(message, context = 'Server') {
    this.printMessage('info', message, context);
  }

  fatal(message, context = 'Server') {
    this.printMessage('fatal', message, context);
  }

  async printMessage(level, message, context) {
    const chalk = (await import('chalk')).default;

    const pid = process.pid;
    const timestamp = this.getTimestamp();
    const coloredLevel = await this.colorByLevel(level, level.toUpperCase());
    const coloredMessage = await this.colorByLevel(level, message);
    const delta = this.showDelta ? this.formatDelta() : '';

    const coloredAppName = chalk.green(`[${this.appName}]`);
    const coloredPid = chalk.green(`${pid}`);
    const coloredTimestamp = chalk.white(timestamp);
    const coloredContext = chalk.yellow(`[${context}]`);
    const coloredDelta = delta ? chalk.yellow(delta) : '';

    const formatted = `'[Logger] ${coloredPid} - ${coloredTimestamp} ${coloredLevel} ${coloredContext} ${coloredMessage} ${coloredDelta}`.trim();

    console.log(formatted);
  }
}

module.exports = { logger: new LoggerService() };
