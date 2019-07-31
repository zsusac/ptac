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
  const writeToFile = (fileName, content) => {
    logger.info(`Start writing to ${fileName} file`)
    fs.writeFile(fileName, content, function (error) {
      if (error) {
        logger.error(error.message)
      }
    })
  }

  /**
   * Return file content as string.
   *
   * @param {*} file
   * @param {*} encoding
   */
  const fileToString = (file, encoding) => {
    logger.info(`Start reading ${file} file`)
    return fs.readFileSync(file, encoding)
  }

  return {
    writeToFile: writeToFile,
    fileToString: fileToString
  }
})()

module.exports = file
