'use strict'
const fs = require('fs')
const path = require('path')
const loadmodel = require('./loadmodel')
const Xml2object = require('xml2object')

class ltsanalyzer {
  constructor (options) {
    this.verbose = options.verbose
    this.zero = options.zero
    this.prefix = options.ltsprefix
    this.destdir = options.destdir
    this.ways = {}
    this.nodes = {}
    this.onCompleteLoadWays = this.onCompleteLoadWays.bind(this)
    this.processNodes = this.processNodes.bind(this)
  }

  Run (name, osmfilename, onComplete) {
    this.onCompleteRun = onComplete
    this.model = loadmodel(name)
    if (this.model !== null) {
      if (this.verbose) console.log('Loading "' + osmfilename + '"...')
      this.loadWays(osmfilename)
    } else {
      onComplete('Invalid model name: ' + name)
    }
  }

  loadWays (path) {
    // Create a new xml parser with an array of xml elements to look for
    let parser = new Xml2object([ 'way', 'node' ], path)

    // Bind to the object event to work with the objects found in the XML file
    parser.on('object', this.processNodes)

    // Bind to the file end event to tell when the file is done being streamed
    parser.on('end', this.onCompleteLoadWays)

    // Start parsing the XML
    parser.start()
  }

  onCompleteLoadWays () {
    let err = null
    if (!this.analyzeWays()) {
      err = 'Failure while analyzing the ways'
    } else {
      if (!this.createLevelFiles()) {
        err = 'Failure while creating the level files'
      }
    }
    this.onCompleteRun(err)
  }

  processNodes (name, childNode) {
    if (name === 'way') {
      let newway = {level: 0, tags: {}, nodes: []}
      let tags = childNode.tag
      if (Array.isArray(tags)) {
        for (let t in childNode.tag) {
          newway.tags[childNode.tag[t].k] = childNode.tag[t].v
        }
      }
      else if (typeof tags !== 'undefined') {
        newway.tags[tags.k] = tags.v
      }
      let limit = childNode.nd.length
      for (let i = 0; i < limit; i++) {
        newway.nodes.push(childNode.nd[i].ref)
      }
      if (this.model.isBikingPermitted(newway) || (this.zero && typeof newway.tags['highway'] !== 'undefined')) {
        this.ways[childNode.id] = newway
      }
    } else if (name === 'node') {
      let newnode = {lat: childNode.lat, lon: childNode.lon}
      this.nodes[childNode.id] = newnode
    }
  }

  analyzeWays () {
    if (this.verbose) console.log('Analyzing using model "' + this.model.name + '"...')
    for (let id in this.ways) {
      if (this.ways.hasOwnProperty(id)) {
        let way = this.ways[id]
        way.level = this.model.evaluateLTS(way).lts
      }
    }
    return true
  }

  createLevelFiles () {
    if (this.verbose) console.log('Saving stress level files...')
    let levels = this.model.levels

    let prefix = this.prefix
    let startLevel = this.zero ? 0 : 1
    for (let level = startLevel; level <= levels; level++) {
      let lfilename = path.join(this.destdir, prefix + level.toString() + '.json')
      if (fs.existsSync(lfilename)) {
        fs.unlinkSync(lfilename)
      }
      const file = fs.createWriteStream(lfilename)
      file.write('{"type":"FeatureCollection","features":[')
      let fsep = false
      for (let id in this.ways) {
        if (!this.ways.hasOwnProperty(id)) continue
        let way = this.ways[id]
        if (way.level === level) {
          if (fsep) {
            file.write(',')
          }
          fsep = true
          file.write('{"type":"Feature","id":"way/')
          file.write(id)
          file.write('","properties":{"id":"way/')
          file.write(id)
          file.write('"},"geometry":{"type":"LineString","coordinates":[')
          let csep = false
          let ln = way.nodes.length
          for (let i = 0; i < ln; i++) {
            let nodeid = way.nodes[i]
            let node = this.nodes[nodeid]
            if (csep) {
              file.write(',')
            }
            csep = true
            file.write('[')
            file.write(this.formatLatLong(node.lon))
            file.write(',')
            file.write(this.formatLatLong(node.lat))
            file.write(']')
          }
          file.write(']}}')
        }
      }
      file.write(']}')
      file.end()
    }
    return true
  }

  formatLatLong (latlong) {
    return (latlong[latlong.length - 1] === '0') ? parseFloat(latlong).toString() : latlong
  }
}

module.exports = ltsanalyzer
