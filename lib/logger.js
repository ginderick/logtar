const fs = require("node:fs/promises");
const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");

class Logger {
  /**
   *@type {LogConfig}
   */
  #config;

  /**
   *
   *@type {fs.FileHandle}
   */
  #log_file_handle;

  async init() {
    const file_name = `${
      this.#config.file_prefix + new Date().toISOString().replace(/[\.:]+/, "-")
    }.log`;
    this.#log_file_handle = await fs.open(file_name, "a+");
    console.log("File created");
  }

  /**
   *@returns {Logger} A new instance of Logger with default config
   *
   */
  static with_defaults() {
    return new Logger();
  }

  /**
   *
   * @return {Logger} A new instance of Logger with the given config
   * @param {LogConfig} logConfig
   */
  static with_config(logConfig) {
    return new Logger(logConfig);
  }

  /**
   *@param {LogLevel} log_level
   */
  constructor(logConfig) {
    logConfig ||= LogConfig.with_defaults();
    LogConfig.assert(logConfig);
    this.#config = logConfig;
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

  #log(message, logLevel) {
    if (logLevel < this.#config.level) {
      return;
    }
    console.log("%s: %s", message, LogLevel.to_string(logLevel));
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
