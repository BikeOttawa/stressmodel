'use strict'
var fs = require('fs')

class Options {
  constructor () {
    this.destdir = '.'
    this.indent = false
    this.ltsprefix = 'level_'
    this.osmfilename = ''
    this.model = 'default'
    this.verbose = false
    this.zero = false
  }

  usage () {
    console.log('Open Street Map Cycling Stress Analyzer')
    console.log(' ')
    console.log('Usage: ltsanalyzer [OPTION] -f FILE')
    console.log('Accepts an .osm FILE containing way and node information for ')
    console.log('a region and outputs a set of GeoJSON stress level files containing ')
    console.log('the ways that correspond to each calculated stress level.')
    console.log(' ')
    console.log('Mandatory arguments to long options are mandatory for short options too. ')
    console.log('  -d, --destdir        Directory where all output files will be created.')
    console.log('  -f, --filename=NAME  Filename is path to the OSM XML input file.')
    console.log('  -h, --help           Displays this help and exits.')
    console.log('  -i, --indent         Indent the output files in a readable format.')
    console.log('  -p, --prefix=PREFIX  The prefix to be used for all output files. The')
    console.log('                       default is "level_".')
    console.log('  -v, --verbose        Enables verbose output.')
    console.log('  -z, --zero           Generate zero level file containing all ways')
    console.log('                       where cycling is not permitted.')
  }

  Load (args) {
    var help = false
    for (var i = 2; i < args.length; i++) {
      var arg = args[i].trim().toLowerCase()
      if (arg === '-f' || arg === '--filename') {
        if (args.length >= i) {
          i++
          this.osmfilename = args[i]
        } else {
          console.log('Error: -f command line argument must be followed by a file path.')
          return false
        }
      } else if (arg === '-d' || arg === '--destdir') {
        if (args.length >= i) {
          i++
          this.destdir = args[i]
        } else {
          console.log('Error: -f command line argument must be followed by a file path.')
          return false
        }
      } else if (arg === '-i' || arg === '--indent') {
        this.indent = true
      } else if (arg === '-h' || arg === '--help') {
        help = true
      } else if (arg === '-p' || arg === '--prefix') {
        if (args.length >= i) {
          i++
          this.ltsprefix = args[i]
        } else {
          console.log('Error: -p command line argument must be followed by a file prefix.')
          return false
        }
      } else if (arg === '-v' || arg === '--verbose') {
        this.verbose = true
      } else if (arg === '-z' || arg === '--zero') {
        this.zero = true
      } else {
        console.log('Unknown option "' + arg + '". Try --help for more information.')
        return false
      }
    }
    if (help) {
      this.usage()
      return false
    } else if (this.osmfilename.length === 0 || this.ltsprefix.length === 0) {
      this.usage()
      return false
    } else {
      if (!fs.existsSync(this.osmfilename)) {
        console.log('Error: File "' + this.osmfilename + '" does not exist.')
        return false
      }
    }
    return true
  }
}

module.exports = Options
