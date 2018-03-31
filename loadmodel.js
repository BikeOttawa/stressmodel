'use strict'
let stressmodel = require('./stressmodel.js')

module.exports = function (name) {
  return (name === 'default' || name.length === 0) ? stressmodel : null
}
