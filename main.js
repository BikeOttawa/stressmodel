'use strict'
const Options = require('./options')
const LTSAnalyzer = require('./ltsanalyzer')

let options = new Options()
const args = process.argv
if (options.Load(args)) {
  if (options.verbose) console.log('Cycling Level of Traffic Stress Model')
  const lts = new LTSAnalyzer(options)
  lts.Run(options.model, options.osmfilename, runComplete)
} else {
  runComplete('An error occurred while parsing the command line.')
}

function runComplete (err) {
  process.exitCode = err ? 1 : 0
  if (options.verbose) console.log(err ? 'Processing failed. ' + err : 'Processing successful.')
}
