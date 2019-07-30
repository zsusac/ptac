'use strict'

const waybackurls = require('../tools/waybackurls')

waybackurls.run('span.eu').then(function (res) {
  console.log('res', res)
})
