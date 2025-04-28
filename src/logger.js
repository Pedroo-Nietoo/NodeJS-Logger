class LoggerService {
  constructor(appName = 'Logger', showDelta = false) {
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

  log(message, context = 'Server', showDelta) {
    this.printMessage('log', message, context, showDelta);
  }

  error(message, context = 'Server', showDelta) {
    this.printMessage('error', message, context, showDelta);
  }

  warn(message, context = 'Server', showDelta) {
    this.printMessage('warn', message, context, showDelta);
  }

  debug(message, context = 'Server', showDelta) {
    this.printMessage('debug', message, context, showDelta);
  }

  verbose(message, context = 'Server', showDelta) {
    this.printMessage('verbose', message, context, showDelta);
  }

  info(message, context = 'Server', showDelta) {
    this.printMessage('info', message, context, showDelta);
  }

  fatal(message, context = 'Server', showDelta) {
    this.printMessage('fatal', message, context, showDelta);
  }

  async printMessage(level, message, context, showDelta = this.showDelta) {
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

module.exports = { logger: new LoggerService() };
