const axios = require('axios')
const logger = require('../utilities/logger')

/**
 * Penetration Test as Code (PTaC) waybackurls tool.
 *
 */
let waybackurls = (function () {
  /**
   * Run waybackurls tool.
   *
   * @param {string} url
   *
   * @returns {Promise} request
   */
  async function run (url) {
    logger.info('Starting waybackurls tool...')
    return axios.get(`http://web.archive.org/cdx/search/cdx?url=${url}/*&output=json&fl=original&collapse=urlkey`)
      .then(function (response) {
        return JSON.stringify(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function () {
      })
  }

  return {
    run: run
  }
})()

module.exports = waybackurls
