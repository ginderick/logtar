const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");

class Logger {
  /**
   *@type {LogConfig}
   */
  #config;

  /**
   *@returns {Logger} A new instance of Logger with default config
   **/
  static with_defaults() {
    return new Logger();
  }

  /**
   *
   * @param {LogConfig} log_config
   * @return {Logger} A new instance of Logger with the given config
   */
  static with_config(log_config) {
    return new Logger(log_config);
  }

  /**
   *@param {LogLevel} log_level
   */
  constructor(log_config) {
    log_config = log_config || LogConfig.with_defaults();
    LogConfig.assert(log_config);
    this.#config = log_config;
  }

  /**
   *@returns {LogLevel} The current log level
   */
  get level() {
    return this.#config.level;
  }

  get file_prefix() {
    return this.#config.file_prefix;
  }

  get time_threshold() {
    return this.#config.rolling_config.time_threshold;
  }

  get size_threshold() {
    return this.#config.rolling_config.size_threshold;
  }

  #log(message, log_level) {
    console.log("%s: %s", message, LogLevel.to_string(log_level));
  }

  debug(message) {
    this.#log(message, LogLevel.Debug);
  }

  info(message) {
    this.#log(message, LogLevel.Info);
  }

  warn(message) {
    this.#log(message, LogLevel.Warn);
  }

  error(message) {
    this.#log(message, LogLevel.Error);
  }

  critical(message) {
    this.#log(message, LogLevel.Critical);
  }
}

module.exports = { Logger };
