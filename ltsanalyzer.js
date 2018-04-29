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
    this.inputfile = ''
    this.onCompleteLoadWays = this.onCompleteLoadWays.bind(this)
    this.onCompleteLoadNodes = this.onCompleteLoadNodes.bind(this)
    this.processWays = this.processWays.bind(this)
    this.processNodes = this.processNodes.bind(this)
  }

  Run (name, osmfilename, onComplete) {
    this.onCompleteRun = onComplete
    this.model = loadmodel(name)
    this.inputfile = osmfilename
    if (this.model !== null) {
      if (this.verbose) console.log('Loading "' + osmfilename + '"...')
      this.loadWays()
    } else {
      onCompleteRun('Invalid model name: ' + name)
    }
  }

  loadWays () {
    // Create a new xml parser with an array of xml elements to look for
    let parser = new Xml2object(['way'], this.inputfile)

    // Bind to the object event to work with the objects found in the XML file
    parser.on('object', this.processWays)

    // Bind to the file end event to tell when the file is done being streamed
    parser.on('end', this.onCompleteLoadWays)

    // Start parsing the XML
    parser.start()
  }

  processWays (name, childNode) {
    if (name === 'way') {
      let newway = {level: 0, tags: {}, nodes: []}
      let tags = childNode.tag
      if (Array.isArray(tags)) {
        for (let t in childNode.tag) {
          if (this.model.usesTag(childNode.tag[t].k)) {
            newway.tags[childNode.tag[t].k] = childNode.tag[t].v
          }
        }
      }
      else if (typeof tags !== 'undefined') {
        if (this.model.usesTag(tags.k)) {
          newway.tags[tags.k] = tags.v
        }
      }
      let limit = childNode.nd.length
      for (let i = 0; i < limit; i++) {
        newway.nodes.push(childNode.nd[i].ref)
      }
      newway.level = this.model.evaluateLTS(newway).lts
      if (newway.level > 0 || (this.zero && typeof newway.tags['highway'] !== 'undefined')) {
        this.ways[childNode.id] = newway
        for (let i = 0; i < newway.nodes.length; i++) {
          this.nodes[newway.nodes[i]] = {}
        }
      }
    } 
  }

  onCompleteLoadWays () {
    // Create a new xml parser with an array of xml elements to look for
    let parser = new Xml2object(['node'], this.inputfile)

    // Bind to the object event to work with the objects found in the XML file
    parser.on('object', this.processNodes)

    // Bind to the file end event to tell when the file is done being streamed
    parser.on('end', this.onCompleteLoadNodes)

    // Start parsing the XML
    parser.start()
  
  }
  
  processNodes (name, childNode) {
    if (name === 'node') {
      let newnode = this.nodes[childNode.id]
      if (typeof newnode !== 'undefined') {
        this.nodes[childNode.id] = {lat: childNode.lat, lon: childNode.lon}
      }
    }
  }

  onCompleteLoadNodes () {
    let err = null
    if (!this.createLevelFiles()) {
      err = 'Failure while creating the level files'
    }
    this.onCompleteRun(err)  
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
      let buffer = '{"type":"FeatureCollection","features":['
      let fsep = false
      for (let id in this.ways) {
        if (!this.ways.hasOwnProperty(id)) continue
        let way = this.ways[id]
        if (way.level === level) {
          if (fsep) {
            buffer += ','
          }
          fsep = true
          buffer += '{"type":"Feature","id":"way/'
          buffer += id
          buffer += '","properties":{"id":"way/'
          buffer += id 
          buffer += '"},"geometry":{"type":"LineString","coordinates":['
          let csep = false
          let ln = way.nodes.length
          for (let i = 0; i < ln; i++) {
            let nodeid = way.nodes[i]
            let node = this.nodes[nodeid]
            if (csep) {
              buffer += ','
            }
            csep = true
            buffer += '['
            buffer += this.formatLatLong(node.lon)
            buffer += ','
            buffer += this.formatLatLong(node.lat)
            buffer += ']'
          }
          buffer += ']}}'
        }
      }
      buffer += ']}'
      fs.writeFileSync(lfilename, buffer)
    }
    return true
  }

  formatLatLong (latlong) {
    return (latlong[latlong.length - 1] === '0') ? parseFloat(latlong).toString() : latlong
  }
}

module.exports = ltsanalyzer
