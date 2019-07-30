const chalk = require('chalk')

/**
 * Penetration Test as Code (PTaC) logger utility.
 *
 */
let logger = (function () {
  /**
   * Log info.
   *
   * @param {string} message
   */
  const info = function (message) {
    console.log(chalk.blue(message))
  }

  /**
   * Log error.
   *
   * @param {string} message
   */
  const error = function (message) {
    console.log(chalk.red(message))
  }

  /**
   * Log success.
   *
   * @param {string} message
   */
  const success = function (message) {
    console.log(chalk.green(message))
  }

  return {
    info: info,
    error: error,
    success: success
  }
})()

module.exports = logger
