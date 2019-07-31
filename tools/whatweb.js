const shelljs = require('shelljs')
const logger = require('../utilities/logger')
const command = require('../utilities/command')
const config = require('../config/tools.json')

/**
 * Penetration Test as Code (PTaC) whatweb wrapper.
 */
let whatweb = (function () {
  /**
   * Command name.
   */
  const commandName = 'whatweb'

  /**
   * Run whatweb command.
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
   * Run whatweb command synchronously.
   *
   * @param {string} options
   * @param {string} url
   *
   * @return {string} Command output
   */
  const runSync = (options, url) => {
    return shelljs.exec(`${commandName} ${options} ${url}`, {
      silent: config.silent
    }).stdout
  }

  /**
   * Run whatweb command asynchronously.
   *
   * @param {string} options
   * @param {string} url
   * @param {function} callback
   *
   * @return {string} Command output
   */
  const runAsync = (options, url, callback) => {
    return shelljs.exec(`${commandName} ${options} ${url}`, {
      silent: config.silent,
      async: true
    }, (code, stdout, stderr) => {
      if (stderr) {
        logger.error(`whatweb: ${stderr}`)
        shelljs.exit(1)
      }
      logger.info(`Finished ${commandName} command...`)
      callback()
    }).stdout
  }

  /**
   * Check if website is Drupal CMS.
   *
   * @param {string} options
   * @param {string} urls
   *
   * @return {bool}
   */
  const isDrupal = (options, urls, callback) => {
    var result = whatweb.run(options, urls, callback)
    if (result.includes('Drupal')) {
      return true
    }
    return false
  }

  /**
   * Check if website is WordPress CMS.
   *
   * @param {string} options
   * @param {string} urls
   *
   * @return {bool}
   */
  const isWordPress = (options, urls, callback) => {
    var result = whatweb.run(options, urls, callback)
    if (result.includes('WordPress')) {
      return true
    }
    return false
  }

  return {
    run: run,
    isDrupal: isDrupal,
    isWordPress: isWordPress
  }
})()

module.exports = whatweb
