const path = require("node:path");
const { Logger } = require("./index");

async function initialize_logger() {
  const logger = Logger.with_defaults();
  await logger.init();

  return logger;
}

async function main() {
  const logger = await initialize_logger();
  logger.critical("From the main() function");
  nested_func(logger);
}

function nested_func(logger) {
  logger.critical("From the nested_func() function");
  super_nested(logger);
}

function super_nested(logger) {
  logger.critical("From the super_nested() function");
}

main();
