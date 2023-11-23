const { Logger, LogConfig } = require("./index");

const logger = Logger.with_config(LogConfig.from_file("./config.json"));
