const shelljs = require('shelljs')
const logger = require('../utilities/logger')
const command = require('../utilities/command')
const config = require('../config/tools.json')

/**
 * Penetration Test as Code (PTaC) wpscan wrapper.
 */
let wpscan = (function () {
  /**
   * Command name.
   */
  const commandName = 'wpscan'

  /**
   * Run wpscan command.
   *
   * @param {string} options
   * @param {string} url
   *
   * @return {string} Command output
   */
  const run = (options, url) => {
    command.exitIfNotInstalled(commandName)
    logger.info(`Starting ${commandName} command...`)
    return shelljs.exec(`${commandName} ${options} --url ${url}`, {
      silent: config.silent
    }).stdout
  }

  return {
    run: run
  }
})()

module.exports = wpscan
