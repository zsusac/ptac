const shelljs = require('shelljs')
const stripAnsi = require('strip-ansi')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) sublist3r wrapper.
 */
let sublist3r = (function () {
  /**
   * Run sublist3r command.
   *
   * @param {*} options
   * @param {*} url
   *
   * @return {string} Command output
   */
  const run = (options, url) => {
    logger.info('Starting sublist3r command...')
    return shelljs.exec(`sublist3r ${options} -d ${url}`, {
      silent: false
    }).stdout
  }

  /**
   * Get subdomains.
   *
   * @param {*} options
   * @param {*} url
   *
   * @return {Array.<String>} Array of subdomains
   */
  const getSubdomains = (options, url) => {
    const sublist3rControlLine = 'Total Unique Subdomains Found'
    let subdomains = []

    let result = sublist3r.run(options, url)
    let lines = result.split('\n')

    let ignoreNextLine = true
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      if (!ignoreNextLine && line) {
        subdomains.push(stripAnsi(line.trim()))
      }
      if (line.includes(sublist3rControlLine)) {
        ignoreNextLine = false
      }
    }

    return subdomains
  }

  return {
    run: run,
    getSubdomains: getSubdomains
  }
})()

module.exports = sublist3r
