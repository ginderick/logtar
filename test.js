const { Logger, LogConfig } = require("./index");

async function main() {
  const logger = Logger.with_config(LogConfig.from_file("./config.json"));
  await logger.init();
  console.log("End of the file");
}

main();
