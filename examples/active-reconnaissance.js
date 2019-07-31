const fs = require('fs')
const parseString = require('xml2js').parseString

const nmap = require('../tools/nmap')
const whatweb = require('../tools/whatweb')
const sublist3r = require('../tools/sublist3r')
const wpscan = require('../tools/wpscan')
const droopescan = require('../tools/droopescan')
const waybackurls = require('../tools/waybackurls')
const fileUtility = require('../utilities/file')
const logger = require('../utilities/logger')

const startingDirectory = process.cwd()
let url = process.argv[2]

// Find subdomains
let subdomains = sublist3r.getSubdomains('', url)

// Create subdomains directory
if (!fs.existsSync(`${startingDirectory}/subdomains`)) {
  fs.mkdirSync(`${startingDirectory}/subdomains`)
}

for (let i = 0; i < subdomains.length; i++) {
  const subdomain = subdomains[i]
  const subdomainDirectoryPath = `${startingDirectory}/subdomains/${subdomain}`

  // Create subdomain directory
  if (!fs.existsSync(subdomainDirectoryPath)) {
    fs.mkdirSync(subdomainDirectoryPath)
  }

  // Scan with nmap
  let nmapXMLFilename = `${subdomainDirectoryPath}/nmap.xml`
  let nmapJSONFilename = `${subdomainDirectoryPath}/nmap.json`
  nmap.run(`-oX ${nmapXMLFilename}`, subdomain)

  // Convert xml to json
  var nmapXML = fs.readFileSync(`${nmapXMLFilename}`, 'utf8')
  parseString(nmapXML, function (_err, result) {
    const jsonString = JSON.stringify(result)
    fileUtility.writeToFile(nmapJSONFilename, jsonString)
  })

  // Run waybackurls tool
  waybackurls.run(subdomain).then(function (response) {
    fileUtility.writeToFile(`${subdomainDirectoryPath}/waybackurls.json`, response)
  })

  // Scan with whatweb
  whatweb.run(`--log-json=${subdomainDirectoryPath}/whatweb.json`, `${subdomain}`, () => {
    let whatwebResult = fileUtility.fileToString(`${subdomainDirectoryPath}/whatweb.json`, 'utf8')

    // Scan with wpscan
    if (whatwebResult.includes('WordPress')) {
      wpscan.run(`-o ${subdomainDirectoryPath}/wpscan.json -f json`, `${subdomain}`, () => {
        logger.info(`wpscan ${subdomain} finished...`)
      })
    }

    // Scan drupal site with droopescan
    if (whatwebResult.includes('Drupal')) {
      droopescan.run(`scan drupal -o json`, `${subdomain}`, `${subdomainDirectoryPath}/droopescan_drupal.json`, () => {})
    }

    // Scan joomla site with droopescan
    if (whatwebResult.includes('Joomla')) {
      droopescan.run(`scan joomla -o json`, `${subdomain}`, `${subdomainDirectoryPath}/droopescan_joomla.json`, () => {})
    }

    // Scan moodle site with droopescan
    if (whatwebResult.includes('Moodle')) {
      droopescan.run(`scan moodle -o json`, `${subdomain}`, `${subdomainDirectoryPath}/droopescan_moodle.json`, () => {})
    }

    // Scan silverstripe site with droopescan
    if (whatwebResult.includes('Silverstripe')) {
      droopescan.run(`scan silverstripe -o json`, `${subdomain}`, `${subdomainDirectoryPath}/droopescan_silverstripe.json`, () => {})
    }
  })
}
