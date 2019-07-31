const shelljs = require('shelljs')
const stripAnsi = require('strip-ansi')
const logger = require('../utilities/logger')
const command = require('../utilities/command')
const config = require('../config/tools.json')

/**
 * Penetration Test as Code (PTaC) sublist3r wrapper.
 */
let sublist3r = (function () {
  /**
   * Command name.
   */
  const commandName = 'sublist3r'

  /**
   * Run sublist3r command.
   *
   * @param {string} options
   * @param {string} url
   *
   * @return {string} Command output
   */
  const run = (options, url) => {
    command.exitIfNotInstalled(commandName)
    logger.info(`Starting ${commandName} command...`)
    return shelljs.exec(`${commandName} ${options} -d ${url}`, {
      silent: config.silent
    }).stdout
  }

  /**
   * Get subdomains.
   *
   * @param {string} options
   * @param {string} url
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
