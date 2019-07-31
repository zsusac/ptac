const shelljs = require('shelljs')
const logger = require('../utilities/logger')
const command = require('../utilities/command')
const fileUtility = require('../utilities/file')
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
   * @param {function} callback
   */
  const run = (options, url, outputFile, callback) => {
    command.exitIfNotInstalled(commandName)
    logger.info(`Starting ${commandName} command...`)
    if (outputFile && callback) {
      return runAsync(options, url, outputFile, callback)
    } else {
      return runSync(options, url)
    }
  }

  /**
   * Run droopescan command synchronously.
   *
   * @param {string} options
   * @param {string} url
   *
   * @return {string} Command output
   */
  const runSync = (options, url) => {
    return shelljs.exec(`${commandName} ${options} -u ${url}`, {
      silent: config.silent
    }).stdout
  }

  /**
   * Run droopescan command asynchronously.
   *
   * @param {string} options
   * @param {string} url
   * @param {string} outputFile
   * @param {function} callback
   *
   * @return {string} Command output
   */
  const runAsync = (options, url, outputFile, callback) => {
    return shelljs.exec(`${commandName} ${options} -u ${url}`, {
      silent: config.silent,
      async: true
    }, (code, stdout, stderr) => {
      if (stderr) {
        logger.error(`droopescan: ${stderr}`)
        shelljs.exit(1)
      }
      logger.info(`Finished ${commandName} command...`)
      fileUtility.writeToFile(`${outputFile}`, stdout)
      callback()
    }).stdout
  }

  return {
    run: run
  }
})()

module.exports = droopescan
