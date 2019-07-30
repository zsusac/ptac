const fs = require('fs')
const parseString = require('xml2js').parseString

const nmap = require('../tools/nmap')
const whatweb = require('../tools/whatweb')
const sublist3r = require('../tools/sublist3r')
const wpscan = require('../tools/wpscan')
const droopescan = require('../tools/droopescan')
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
  let httpServicePorts = nmap.getHTTPServicePorts(`-oX ${nmapXMLFilename}`, subdomain)

  // Convert xml to json
  var nmapXML = fs.readFileSync(`${nmapXMLFilename}`, 'utf8')
  parseString(nmapXML, function (_err, result) {
    const jsonString = JSON.stringify(result)
    fileUtility.writeToFile(nmapJSONFilename, jsonString)
  })

  for (let j = 0; j < httpServicePorts.length; j++) {
    let scheme = httpServicePorts[j] === 443 ? 'https://' : 'http://'

    // Scan with whatweb
    let whatwebResult = whatweb.run(`--log-json=whatweb_${subdomain}_${httpServicePorts[j]}.json --url-prefix ${scheme}`, `${subdomain}:${httpServicePorts[j]}`)

    // Scan with wpscan
    if (whatwebResult.includes('WordPress')) {
      wpscan.run(`-o wpscan_${subdomain}_${httpServicePorts[j]}.json -f json`, `${scheme}${subdomain}:${httpServicePorts[j]}`)
    }

    let droopescanResult = ''
    // Scan drupal site with droopescan
    if (whatwebResult.includes('Drupal')) {
      droopescanResult = droopescan.run(`scan drupal -o json`, `${scheme}${subdomain}:${httpServicePorts[j]}`)
      fileUtility.writeToFile(`droopescan_drupal_${subdomain}.json`, droopescanResult)
    }

    // Scan joomla site with droopescan
    if (whatwebResult.includes('Joomla')) {
      droopescanResult = droopescan.run(`scan joomla -o json`, `${scheme}${subdomain}:${httpServicePorts[j]}`)
      fileUtility.writeToFile(`droopescan_joomla_${subdomain}.json`, droopescanResult)
    }

    // Scan moodle site with droopescan
    if (whatwebResult.includes('Moodle')) {
      droopescanResult = droopescan.run(`scan moodle -o json`, `${scheme}${subdomain}:${httpServicePorts[j]}`)
      fileUtility.writeToFile(`droopescan_moodle_${subdomain}.json`, droopescanResult)
    }

    // Scan silverstripe site with droopescan
    if (whatwebResult.includes('Silverstripe')) {
      droopescanResult = droopescan.run(`scan silverstripe -o json`, `${scheme}${subdomain}:${httpServicePorts[j]}`)
      fileUtility.writeToFile(`droopescan_silverstripe_${subdomain}.json`, droopescanResult)
    }
  }
}
