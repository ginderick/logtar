const fs = require("node:fs");

class LogLevel {
  static Debug = 0;
  static Info = 1;
  static Warn = 2;
  static Error = 3;
  static Critical = 4;

  static assert(log_level) {
    if (
      ![
        LogLevel.Debug,
        LogLevel.Info,
        LogLevel.Warn,
        LogLevel.Error,
        LogLevel.Critical,
      ].includes(log_level)
    ) {
      throw new Error(
        `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(
          log_level,
        )}`,
      );
    }
  }
}

class Logger {
  /**
   *
   * @type {LogConfig}
   *
   *
   **/
  #config;

  /**
   *
   * @returns {Logger} A new instance of Logger with default values
   * @description the default log level is `LogLevel.Info`
   */
  static with_defaults() {
    return new Logger();
  }

  /**
   * @param {LogConfig} log_config The log config to be used
   * @return {Logger} A new instance of Logger with the specified log config.
   * @throws {Error} If the log_config is not an instance of LogConfig
   *
   */
  static with_config(log_config) {
    return new Logger(log_config);
  }

  constructor(log_config) {
    log_config = log_config || LogConfig.with_defaults();
    LogConfig.assert(log_config);
    this.#config = log_config;
  }

  get level() {
    return this.#config.level;
  }
}

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

class RollingSizeOptions {
  static OneKB = 1024;
  static FiveKB = 5 * 1024;
  static TenKB = 10 * 1024;
  static TwentyKB = 20 * 1024;
  static FiftyKB = 50 * 1024;
  static HundredKB = 100 * 1024;

  static HalfMB = 512 * 1024;
  static OneMB = 1024 * 1024;
  static FiveMB = 5 * 1024 * 1024;
  static TenMB = 10 * 1024 * 1024;
  static TwentyMB = 20 * 1024 * 1024;
  static FiftyMB = 50 * 1024 * 1024;
  static HundredMB = 100 * 1024 * 1024;

  static assert(size_threshold) {
    if (
      typeof size_threshold !== "number" ||
      size_threshold < RollingSizeOptions.OneKB
    ) {
      throw new Error(
        `size_threshold must be at least 1 KB. Unsupported param ${JSON.stringify(
          size_threshold,
        )}`,
      );
    }
  }
}

class RollingTimeOptions {
  static Minutely = 60;
  static Hourly = 60 * this.Minutely;
  static Daily = 24 * this.Hourly;
  static Weekly = 7 * this.Daily;
  static Monthly = 30 * this.Daily;
  static Yearly = 12 * this.Monthly;

  static assert(time_option) {
    if (
      ![
        this.Minutely,
        this.Hourly,
        this.Daily,
        this.Weekly,
        this.Monthly,
        this.Yearly,
      ].includes(time_option)
    ) {
      throw new Error(
        `time_option must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
          time_option,
        )}`,
      );
    }
  }
}

class RollingConfig {
  #time_threshold = RollingTimeOptions.Hourly;
  #size_threshold = RollingSizeOptions.FiveMB;

  static assert(rolling_config) {
    if (!(rolling_config instanceof RollingConfig)) {
      throw new Error(
        `rolling_config must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
          rolling_config,
        )}`,
      );
    }
  }

  static with_defaults() {
    return new RollingConfig();
  }

  with_size_threshold(size_threshold) {
    RollingSizeOptions.assert(size_threshold);
    this.#size_threshold = size_threshold;
    return this;
  }

  with_time_threshold(time_threshold) {
    RollingTimeOptions.assert(time_threshold);
    this.#time_threshold = time_threshold;
    return this;
  }

  static from_json(json) {
    let rolling_config = new RollingConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case "size_threshold":
          rolling_config = rolling_config.with_size_threshold(json[key]);
          break;

        case "time_threshold":
          rolling_config = rolling_config.with_time_threshold(json[key]);
          break;
      }
    });
    return rolling_config;
  }
}

module.exports = {
  Logger,
  LogLevel,
  LogConfig,
  RollingConfig,
  RollingSizeOptions,
  RollingTimeOptions,
};

const config = LogConfig.from_file("./config.demo.json");
const logger = Logger.with_config(config);
