class LoggerService {
  constructor(appName = 'Logger', options = {}) {
    this.appName = appName;
    this.lastTimestamp = Date.now();

    const {
      format = 'text',
      timestamp = true,
      timeDelta = false,
      time = true,
      date = true,
    } = options;

    this.format = format;
    this.showTimestamp = timestamp;
    this.showDelta = timeDelta;
    this.includeTime = time;
    this.includeDate = date;
  }

  getTimestamp() {
    const now = new Date();

    if (!this.includeTime && !this.includeDate) return '';

    const options = {};
    if (this.includeDate) {
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
    }
    if (this.includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
      options.hour12 = true;
    }

    return now.toLocaleString('pt-BR', options);
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

  async printMessage(level, message, context, showDeltaOverride) {
    const chalk = (await import('chalk')).default;

    const pid = process.pid;
    const timestamp = this.showTimestamp ? this.getTimestamp() : '';
    const delta = (showDeltaOverride !== undefined ? showDeltaOverride : this.showDelta) ? this.formatDelta() : '';

    const coloredLevel = await this.colorByLevel(level, level.toUpperCase());
    const coloredMessage = await this.colorByLevel(level, message);
    const coloredAppName = await this.colorByLevel(level, `[${this.appName}]`);
    const coloredPid = await this.colorByLevel(level, `${pid}`);
    const coloredTimestamp = chalk.white(timestamp);
    const coloredContext = chalk.yellow(`[${context}]`);
    const coloredDelta = delta ? chalk.yellow(delta) : '';

    if (this.format === 'json') {
      console.log(JSON.stringify({
        level,
        message,
        context,
        app: this.appName,
        timestamp,
        pid,
        delta,
      }));
    } else {
      const formatted = `${coloredAppName} ${coloredPid} - ${coloredTimestamp} ${coloredLevel} ${coloredContext} ${coloredMessage} ${coloredDelta}`.trim();
      console.log(formatted);
    }
  }
}

module.exports = {
  logger: new LoggerService(),
  LoggerService,
};
