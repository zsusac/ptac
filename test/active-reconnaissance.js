const fs = require('fs')
const parseString = require('xml2js').parseString

const nmap = require('../tools/nmap')
const whatweb = require('../tools/whatweb')
const sublist3r = require('../tools/sublist3r')
const wpscan = require('../tools/wpscan')
const droopescan = require('../tools/droopescan')
const waybackurls = require('../tools/waybackurls')
const fileUtility = require('../utilities/file')

const startingDirectory = process.cwd()
let url = process.argv[2]

// Find subdomains
let subdomains = sublist3r.getSubdomains('', url)

for (let i = 0; i < subdomains.length; i++) {
  const subdomain = subdomains[i]

  // Create subdomain directory
  if (!fs.existsSync(`${startingDirectory}/${subdomain}`)) {
    fs.mkdirSync(`${startingDirectory}/${subdomain}`)
  }
  process.chdir(`${startingDirectory}/${subdomain}`)

  // Scan with nmap
  let nmapXMLFilename = `nmap_${subdomain}.xml`
  let nmapJSONFilename = `nmap_${subdomain}.json`
  nmap.run(`-oX ${nmapXMLFilename}`, subdomain)

  // Convert xml to json
  var nmapXML = fs.readFileSync(`${nmapXMLFilename}`, 'utf8')
  parseString(nmapXML, function (_err, result) {
    const jsonString = JSON.stringify(result)
    fileUtility.writeToFile(nmapJSONFilename, jsonString)
  })

  // Run waybackurls tool
  waybackurls.run(subdomain).then(function (response) {
    fileUtility.writeToFile(`${startingDirectory}/${subdomain}/waybackurls_${subdomain}.json`, response)
  })

  // Scan with whatweb
  let whatwebResult = whatweb.run(`--log-json=whatweb_${subdomain}.json`, `${subdomain}`)

  // Scan with wpscan
  if (whatwebResult.includes('WordPress')) {
    wpscan.run(`-o wpscan_${subdomain}.json -f json`, `${subdomain}`)
  }

  let droopescanResult = ''
  // Scan drupal site with droopescan
  if (whatwebResult.includes('Drupal')) {
    droopescanResult = droopescan.run(`scan drupal -o json`, `${subdomain}`)
    fileUtility.writeToFile(`droopescan_drupal_${subdomain}.json`, droopescanResult)
  }

  // Scan joomla site with droopescan
  if (whatwebResult.includes('Joomla')) {
    droopescanResult = droopescan.run(`scan joomla -o json`, `${subdomain}`)
    fileUtility.writeToFile(`droopescan_joomla_${subdomain}.json`, droopescanResult)
  }

  // Scan moodle site with droopescan
  if (whatwebResult.includes('Moodle')) {
    droopescanResult = droopescan.run(`scan moodle -o json`, `${subdomain}`)
    fileUtility.writeToFile(`droopescan_moodle_${subdomain}.json`, droopescanResult)
  }

  // Scan silverstripe site with droopescan
  if (whatwebResult.includes('Silverstripe')) {
    droopescanResult = droopescan.run(`scan silverstripe -o json`, `${subdomain}`)
    fileUtility.writeToFile(`droopescan_silverstripe_${subdomain}.json`, droopescanResult)
  }
}
