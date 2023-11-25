const fs = require("node:fs/promises");
const path = require("node:path");
const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");
const { check_and_create_dir, get_caller_info } = require("./utils/helpers");

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
    const log_dir_path = check_and_create_dir("logs");

    const file_name = `${
      this.#config.file_prefix + new Date().toISOString().replace(/[\.:]+/, "-")
    }.log`;
    this.#log_file_handle = await fs.open(
      path.join(log_dir_path, file_name),
      "a+",
    );
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

  async #log(message, log_level) {
    if (log_level < this.#config.level || !this.#log_file_handle.fd) {
      return;
    }

    await this.#write_to_handle(message, log_level);
    await this.#rolling_check();
  }

  async #write_to_handle(message, log_level) {
    const date_iso = new Date().toISOString();
    const log_level_string = LogLevel.to_string(log_level);

    const log_message = `[${date_iso}] [${log_level_string}]: ${get_caller_info()} ${message}\n`;

    await this.#log_file_handle.write(log_message);
  }

  async #rolling_check() {
    const { size_threshold, time_threshold } = this.#config.rolling_config;

    const { size, birthtimeMs } = await this.#log_file_handle.stat();
    const current_time = new Date().getTime();

    if (
      size >= size_threshold ||
      current_time - birthtimeMs >= time_threshold * 1000
    ) {
      await this.#log_file_handle.close();
      await this.init();
    }
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
