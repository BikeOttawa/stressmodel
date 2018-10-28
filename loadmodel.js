'use strict'
let stressmodel = require('./stressmodel.js')
let wintermodel = require('./wintermodel.js')

module.exports = function (name) {
  if (name === 'default' || name === 'stressmodel' || name.length == 0) return stressmodel
  if (name === 'wintermodel') return wintermodel
  return null
}
