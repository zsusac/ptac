const shelljs = require('shelljs')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) nmap wrapper.
 */
let nmap = (function () {
  /**
   * Run nmap command.
   *
   * @param {string} options Options
   * @param {string} target Target specification
   *
   * @return {string} Command output
   */
  const run = (options, target) => {
    logger.info('Starting nmap command...')
    return shelljs.exec(`nmap ${options} ${target}`, {
      silent: false
    }).stdout
  }

  /**
   * Get HTTP service ports.
   *
   * @param {string} options Options
   * @param {string} target Target specification
   *
   * @return {Array.<Number>} Array of HTTP ports
   */
  const getHTTPServicePorts = (options, target) => {
    var result = nmap.run(options, target)
    var lines = result.split('\n')
    var httpPorts = []
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].includes('http')) {
        let splitedLine = lines[i].split('/')
        if (splitedLine[0]) {
          let portNumber = parseInt(splitedLine[0])
          if (!isNaN(portNumber)) {
            httpPorts.push(portNumber)
          }
        }
      }
    }
    return httpPorts
  }

  return {
    run: run,
    getHTTPServicePorts: getHTTPServicePorts
  }
})()

module.exports = nmap
