const shelljs = require('shelljs')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) whatweb wrapper.
 */
let whatweb = (function () {
  /**
   * Run whatweb command.
   *
   * @param {*} options
   * @param {*} urls
   *
   * @return {string} Command output
   */
  const run = (options, urls) => {
    logger.info('Starting whatweb command...')
    return shelljs.exec(`whatweb ${options} ${urls}`, {
      silent: false
    }).stdout
  }

  /**
   * Check if website is Drupal CMS.
   *
   * @param {*} options
   * @param {*} urls
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
   * @param {*} options
   * @param {*} urls
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
