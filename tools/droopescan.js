const shelljs = require('shelljs')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) droopescan wrapper.
 */
let droopescan = (function () {
  /**
   * Run droopescan command.
   *
   * @param {*} options
   * @param {*} url
   *
   * @return {string} Command output
   */
  const run = (options, url) => {
    logger.info('Starting droopescan command...')
    return shelljs.exec(`droopescan ${options} -u ${url}`, {
      silent: false
    }).stdout
  }

  return {
    run: run
  }
})()

module.exports = droopescan
