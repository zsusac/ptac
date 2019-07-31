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
   * @param {string} urls
   *
   * @return {string} Command output
   */
  const run = (options, urls) => {
    command.exitIfNotInstalled(commandName)
    logger.info(`Starting ${commandName} command...`)
    return shelljs.exec(`${commandName} ${options} ${urls}`, {
      silent: config.silent
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
  const isDrupal = (options, urls) => {
    var result = whatweb.run(options, urls)
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
  const isWordPress = (options, urls) => {
    var result = whatweb.run(options, urls)
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
