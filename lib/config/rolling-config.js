const {
  RollingTimeOptions,
  RollingSizeOptions,
} = require("../utils/rolling-options");

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

module.exports = { RollingConfig };
