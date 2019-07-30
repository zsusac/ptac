const shelljs = require('shelljs')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) wpscan wrapper.
 */
let wpscan = (function () {
  /**
   * Run wpscan command.
   *
   * @param {*} options
   * @param {*} url
   *
   * @return {string} Command output
   */
  const run = (options, url) => {
    logger.info('Starting wpscan command...')
    return shelljs.exec(`wpscan ${options} --url ${url}`, {
      silent: false
    }).stdout
  }

  return {
    run: run
  }
})()

module.exports = wpscan
