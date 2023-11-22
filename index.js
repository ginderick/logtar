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
  #config;

  constructor(log_config) {
    log_config = log_config || LogConfig.with_defaults();
    LogConfig.assert(log_config);
    this.#config = log_config;
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

  with_log_level(log_level) {
    LogLevel.assert(log_level);
    this.#level = log_level;
    return this;
  }

  with_rolling_config(rolling_config) {
    this.#rolling_config = RollingConfig.from_json(config);
  }


  /****
  *
  * @param {string}
  * @return {LogConfig} The current instance of LogConfig
  * @throws {Error} If the file_prefix is not a string.
  *
  * /
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

module.exports = {
  Logger,
  LogLevel,
};
