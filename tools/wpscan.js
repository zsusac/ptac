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
   * @param {function} callback
   *
   * @return {string} Command output
   */
  const run = (options, url, callback) => {
    command.exitIfNotInstalled(commandName)
    logger.info(`Starting ${commandName} command...`)
    if (callback) {
      runAsync(options, url, callback)
    } else {
      runSync(options, url)
    }
  }

  /**
   * Run wpscan command synchronously.
   *
   * @param {string} options
   * @param {string} url
   *
   * @return {string} Command output
   */
  const runSync = (options, url) => {
    return shelljs.exec(`${commandName} ${options} --url ${url}`, {
      silent: config.silent
    }).stdout
  }

  /**
   * Run wpscan command asynchronously.
   *
   * @param {string} options
   * @param {string} url
   * @param {function} callback
   *
   * @return {string} Command output
   */
  const runAsync = (options, url, callback) => {
    return shelljs.exec(`${commandName} ${options} --url ${url}`, {
      silent: config.silent,
      async: true
    }, (code, stdout, stderr) => {
      if (stderr) {
        logger.error(`wpscan: ${stderr}`)
        shelljs.exit(1)
      }
      logger.info(`Finished ${commandName} command...`)
      callback()
    }).stdout
  }

  return {
    run: run
  }
})()

module.exports = wpscan
