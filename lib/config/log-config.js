const fs = require("node:fs");

const { LogLevel } = require("../utils/log-level");
const { RollingConfig } = require("./rolling-config");

class LogConfig {
  #level = LogLevel.Info;

  #rolling_config;

  #file_prefix = "Logtar_";

  static assert(log_config) {
    if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
      throw new Error(
        `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(
          log_config,
        )}`,
      );
    }
  }

  static with_defaults() {
    return new LogConfig();
  }

  static from_json(json) {
    let log_config = new LogConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case "level":
          log_config = log_config.with_log_level(json[key]);
          break;
        case "rolling_config":
          log_config = log_config.with_rolling_config(json[key]);
          break;
        case "file_prefix":
          log_config = log_config.with_file_prefix(json[key]);
          break;
      }
    });

    return log_config;
  }

  static from_file(file_path) {
    const file_contents = fs.readFileSync(file_path);

    return LogConfig.from_json(JSON.parse(file_contents));
  }

  with_log_level(log_level) {
    LogLevel.assert(log_level);
    this.#level = log_level;
    return this;
  }

  with_rolling_config(config) {
    this.#rolling_config = RollingConfig.from_json(config);
    return this;
  }

  /**
   *
   * @param {string}
   * @return {LogConfig} The current instance of LogConfig
   * @throws {Error} If the file_prefix is not a string.
   *
   */
  with_file_prefix(file_prefix) {
    if (typeof file_prefix !== "string") {
      throw new Error(
        `file_prefix must be a string. Unsupported param ${JSON.stringify(
          file_prefix,
        )}`,
      );
    }

    this.#file_prefix = file_prefix;
    return this;
  }
  /**
   *
   * @param {LogLevel} log_level The log level to be set
   * @returns {LogConfig} The current instance of LogConfig
   */
  with_log_level(log_level) {
    LogLevel.assert(log_level);
    this.#level = log_level;
    return this;
  }

  get level() {
    return this.#level;
  }

  get rolling_config() {
    return this.#rolling_config;
  }

  get file_prefix() {
    return this.#file_prefix;
  }
}

module.exports = { LogConfig };
