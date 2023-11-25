const path = require("node:path");
const { Logger, LogConfig } = require("./index");

async function initialize_logger() {
  const logger = Logger.with_config(
    LogConfig.from_file(path.join(__dirname, "config.json")),
  );

  await logger.init();

  return logger;
}

async function main() {
  const logger = await initialize_logger();
  logger.error("This is an error message");
}

main();
