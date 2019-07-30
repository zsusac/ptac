const fs = require('fs')
const logger = require('./logger')

/**
 * Penetration Test as Code (PTaC) file utility.
*/
let file = (function () {
  /**
   * Write to file.
   *
   * @param {String} fileName
   * @param {String} content
   *
   */
  const writeToFile = function (fileName, content) {
    logger.info(`Start writing to ${fileName} file`)
    fs.writeFile(fileName, content, function (error) {
      if (error) {
        logger.error(error.message)
      }
    })
  }

  return {
    writeToFile: writeToFile
  }
})()

module.exports = file
