const shelljs = require('shelljs')
const config = require('../config/tools.json')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) command utility.
 *
 */
let command = (function () {
  /**
   * Exit if command in not installed on the system.
   *
   * @param {string} commandName
   */
  const exitIfNotInstalled = function (commandName) {
    if (!shelljs.which(`${commandName}`)) {
      logger.error(`${config.missingCommand} ${commandName}`)
      shelljs.exit(1)
    }
  }

  return {
    exitIfNotInstalled: exitIfNotInstalled
  }
})()

module.exports = command
