const shelljs = require('shelljs')
const logger = require('../utilities/logger')
const command = require('../utilities/command')
const config = require('../config/tools.json')

/**
 * Penetration Test as Code (PTaC) droopescan wrapper.
 */
let droopescan = (function () {
  /**
   * Command name.
   */
  const commandName = 'droopescan'

  /**
   * Run droopescan command.
   *
   * @param {string} options
   * @param {string} url
   *
   * @return {string} Command output
   */
  const run = (options, url) => {
    command.exitIfNotInstalled(commandName)
    logger.info(`Starting ${commandName} command...`)
    return shelljs.exec(`${commandName} ${options} -u ${url}`, {
      silent: config.silent
    }).stdout
  }

  return {
    run: run
  }
})()

module.exports = droopescan
