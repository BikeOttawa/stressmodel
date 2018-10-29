'use strict';
const test = require('tape')
const stressmodel = require('../stressmodel.js')
const wintermodel = require('../wintermodel.js')

let stressmodel_ways = [
  {lts: 0, id: 'p1-1', rule: 'p1', tags: { 'lanes': '3', 'maxspeed': '40' }, desc: 'Cycling not permitted. No highway tag.'},
  {lts: 0, id: 'p2-1', rule: 'p2', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '40', 'bicycle': 'no' }, desc: 'Cycling not permitted. bicycle=no'},
  {lts: 0, id: 'p3-1', rule: 'p3', tags: { 'highway': 'motorway', 'lanes': '3', 'maxspeed': '40' }, desc: 'Cycling not permitted. highway=motorway'},
  {lts: 0, id: 'p3-2', rule: 'p3', tags: { 'highway': 'motorway', 'maxspeed': '60', 'motor_vehicle': 'no' }, desc: 'LTS 0: highway=motorway, motor_vehicle=no'},
  {lts: 0, id: 'p4-1', rule: 'p4', tags: { 'highway': 'motorway_link', 'lanes': '3', 'maxspeed': '40' }, desc: 'Cycling not permitted. highway=motorway_link'},
  {lts: 0, id: 'p5-1', rule: 'p5', tags: { 'highway': 'footway', 'lanes': '2', 'maxspeed': '40', 'footway': 'sidewalk' }, desc: 'Cycling not permitted. highway=footway and footway=sidewalk'},
  {lts: 0, id: 'p6-1', rule: 'p6', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '40', 'bicycle': 'yes', 'access': 'no' }, desc: 'Cycling not permitted. access=no'},
  {lts: 1, id: 's1-1', rule: 's1', tags: { 'highway': 'path', 'lanes': '2', 'maxspeed': '40' }, desc: 'Separated Path, highway=path'},
  {lts: 1, id: 's2-1', rule: 's2', tags: { 'highway': 'footway', 'lanes': '2', 'maxspeed': '40' }, desc: 'Separated Path, highway=footway'},
  {lts: 1, id: 's3-1', rule: 's3', tags: { 'highway': 'cycleway', 'lanes': '2', 'maxspeed': '40' }, desc: 'Separated Path, highway=cycleway'},
  {lts: 1, id: 's4-1', rule: 's4', tags: { 'highway': 'construction', 'construction': 'path' }, desc: 'Separated Path, construction path'},
  {lts: 1, id: 's5-1', rule: 's5', tags: { 'highway': 'construction', 'construction': 'footway' }, desc: 'Separated Path, construction footway'},
  {lts: 1, id: 's6-1', rule: 's6', tags: { 'highway': 'construction', 'construction': 'cycleway' }, desc: 'Separated Path, construction cycleway'},
  {lts: 1, id: 's7-1', rule: 's7', tags: { 'highway': 'residential', 'cycleway': 'track', 'maxspeed': '40' }, desc: 'Separated Path, cycleway=track'},
  {lts: 1, id: 's8-1', rule: 's8', tags: { 'highway': 'residential', 'cycleway': 'opposite_track', 'maxspeed': '80' }, desc: 'Separated Path, cycleway=opposite_track, maxspeed=80'},
  {lts: 1, id: 'b1-1', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'crossing', 'maxspeed': '30', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=crossing'},
  {lts: 1, id: 'b1-2', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'parallel' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-3', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'perpendicular' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-4', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'diagonal' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-5', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'yes' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-6', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'marked' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-7', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane:right': 'parallel' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-8', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane:left': 'perpendicular' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-9', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane:both': 'diagonal' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 3, id: 'b2-1', rule: 'b2', tags: { 'highway': 'residential', 'cycleway:middle': 'lane', 'maxspeed': '30', 'lanes': '3', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=middle'},
  {lts: 3, id: 'b2-1', rule: 'b2', tags: { 'highway': 'residential', 'cycleway:middle': 'lane', 'maxspeed': '30', 'lanes': '4', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=middle'},
  // FIXME: No coverage for rule B3, B4, B5 (lane width)
  {lts: 2, id: 'b6-1', rule: 'b6', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2', 'parking': 'yes', 'maxspeed': '41' }, desc: 'Bike lane, parking, cycleway=left, maxspeed=41'},
  {lts: 2, id: 'b6-2', rule: 'b6', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2', 'parking': 'yes', 'maxspeed': '50' }, desc: 'Bike lane, parking, cycleway=left, maxspeed=50'},
  {lts: 2, id: 'b6-3', rule: 'b6', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=left, default maxspeed'},
  {lts: 3, id: 'b7-1', rule: 'b7', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'maxspeed': '51', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=opposite, maxspeed=51'},
  {lts: 3, id: 'b7-2', rule: 'b7', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'maxspeed': '64', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=opposite, maxspeed=64'},
  {lts: 4, id: 'b8-1', rule: 'b8', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'maxspeed': '65', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=opposite, maxspeed=65'},
  {lts: 4, id: 'b8-2', rule: 'b8', tags: { 'highway': 'primary', 'cycleway': 'opposite', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, cycleway=opposite, highway=primary, default maxspped'},
  {lts: 1, id: 'c1-1', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'crossing', 'maxspeed': '30', 'lanes': '1' }, desc: 'Bike lane, cycleway=crossing'},
  {lts: 1, id: 'c1-2', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'lane', 'maxspeed': '30', 'lanes': '1' }, desc: 'Bike lane, cycleway=lane'},
  {lts: 1, id: 'c1-3', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2' }, desc: 'Bike lane, cycleway=left'},
  {lts: 1, id: 'c1-4', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'lanes': '2' }, desc: 'Bike lane, cycleway=left'},
  {lts: 1, id: 'c1-5', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'opposite_lane', 'lanes': '2' }, desc: 'Bike lane, cycleway=opposite_lane'},
  {lts: 1, id: 'c1-6', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'right', 'lanes': '2' }, desc: 'Bike lane, cycleway=right'},
  {lts: 1, id: 'c1-7', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'yes', 'lanes': '2' }, desc: 'Bike lane, cycleway=yes'},
  {lts: 1, id: 'c1-8', rule: 'c1', tags: { 'highway': 'residential', 'shoulder:access:bicycle': 'yes', 'lanes': '2' }, desc: 'Bike lane, shoulder:access:bicycle=yes'},
  // FIXME: No coverage for rule C2 (separating median)
  {lts: 3, id: 'c3-1', rule: 'c3', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'lanes': '3' }, desc: 'Bike lane, cycleway=opposite, lanes=3'},
  {lts: 3, id: 'c3-2', rule: 'c3', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'lanes': '4' }, desc: 'Bike lane, cycleway=opposite, lanes=4'},
  // FIXME: No coverage for rule C4 (lane width)
  {lts: 3, id: 'c5-1', rule: 'c5', tags: { 'highway': 'residential', 'cycleway:both': 'lane', 'maxspeed': '51' }, desc: 'Bike lane, maxspeed=51'},
  {lts: 3, id: 'c5-2', rule: 'c5', tags: { 'highway': 'residential', 'cycleway:middle': 'lane', 'maxspeed': '64' }, desc: 'Bike lane, maxspeed=64'},
  {lts: 4, id: 'c6-1', rule: 'c6', tags: { 'highway': 'residential', 'cycleway:left': 'lane', 'maxspeed': '65' }, desc: 'Bike lane, maxspeed=65'},
  {lts: 4, id: 'c6-2', rule: 'c6', tags: { 'highway': 'residential', 'cycleway:right': 'lane', 'maxspeed': '100' }, desc: 'Bike lane, maxspeed=100'},
  {lts: 4, id: 'c6-3', rule: 'c6', tags: { 'highway': 'secondary', 'cycleway:right': 'lane' }, desc: 'Bike lane, highway=seconary, maxspeed 66+ (default)'},
  {lts: 3, id: 'c7-1', rule: 'c7', tags: { 'highway': 'tertiary', 'cycleway': 'opposite_lane' }, desc: 'Bike lane, non-residential lowspeed'},
  {lts: 1, id: 'm1-1', rule: 'm1', tags: { 'highway': 'steps' }, desc: 'LTS 1: highway=steps.'},
  {lts: 2, id: 'm2-1', rule: 'm2', tags: { 'highway': 'service', 'service': 'alley' }, desc: 'LTS 2: highway=service and service=alley.'},
  {lts: 2, id: 'm3-1', rule: 'm3', tags: { 'highway': 'service', 'service': 'parking_aisle' }, desc: 'LTS 2: highway=service and service=parking_aisle.'},
  {lts: 2, id: 'm4-1', rule: 'm4', tags: { 'highway': 'service', 'service': 'driveway' }, desc: 'LTS 2: highway=service and service=parking_aisle.'},
  {lts: 2, id: 'm5-1', rule: 'm5', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 2, id: 'm5-2', rule: 'm5', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 2, id: 'm5-3', rule: 'm5', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm6-1', rule: 'm6', tags: { 'highway': 'tertiary', 'lanes': '2', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm6-2', rule: 'm6', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm6-3', rule: 'm6', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential, maxspeed=40'},
  {lts: 3, id: 'm7-1', rule: 'm7', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm7-2', rule: 'm7', tags: { 'highway': 'residential', 'lanes': '5', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm7-3', rule: 'm7', tags: { 'highway': 'residential', 'lanes': '5', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential'},
  {lts: 4, id: 'm8-1', rule: 'm8', tags: { 'highway': 'residential', 'lanes': '6', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 4, id: 'm8-2', rule: 'm8', tags: { 'highway': 'residential', 'lanes': '6', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 4, id: 'm8-3', rule: 'm8', tags: { 'highway': 'residential', 'lanes': '7', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential, maxspeed=40'},
  {lts: 2, id: 'm9-1', rule: 'm9', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 2, id: 'm9-2', rule: 'm9', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=residential, maxspeed=49'},
  {lts: 2, id: 'm9-3', rule: 'm9', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=residential, maxspeed=50'},
  {lts: 3, id: 'm10-1', rule: 'm10', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 3, id: 'm10-2', rule: 'm10', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=residential, maxspeed=49'},
  {lts: 3, id: 'm10-3', rule: 'm10', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=residential, maxspeed=50'},
  {lts: 3, id: 'm10-4', rule: 'm10', tags: { 'highway': 'tertiary', 'lanes': '2', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=41'},
  {lts: 3, id: 'm10-5', rule: 'm10', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=49'},
  {lts: 3, id: 'm10-6', rule: 'm10', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=50'},
  {lts: 3, id: 'm10-7', rule: 'm10', tags: { 'highway': 'secondary', 'lanes': '2', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 4, id: 'm11-1', rule: 'm11', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 4, id: 'm11-2', rule: 'm11', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=residential, maxspeed=49'},
  {lts: 4, id: 'm11-3', rule: 'm11', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=residential, maxspeed=50'},
  {lts: 4, id: 'm11-4', rule: 'm11', tags: { 'highway': 'tertiary', 'lanes': '5', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=41'},
  {lts: 4, id: 'm11-5', rule: 'm11', tags: { 'highway': 'tertiary', 'lanes': '5', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=49'},
  {lts: 4, id: 'm11-6', rule: 'm11', tags: { 'highway': 'tertiary', 'lanes': '5', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=50'},
  {lts: 4, id: 'm12-1', rule: 'm12', tags: { 'highway': 'residential', 'lanes': '1', 'maxspeed': '51' }, desc: 'Mixed traffic, highway=residential, lanes=4'},
  {lts: 4, id: 'm12-2', rule: 'm12', tags: { 'highway': 'primary', 'lanes': '1', 'maxspeed': '51' }, desc: 'Mixed traffic, maxspeed 51+'},
  {lts: 4, id: 'm12-3', rule: 'm12', tags: { 'highway': 'primary', 'lanes': '1' }, desc: 'Mixed traffic, default maxspeed on primary highway'},
  {lts: 1, id: 'm13-1', rule: 'm13', tags: { 'highway': 'pedestrian' }, desc: 'LTS 1: highway=pedestrian'},
  {lts: 2, id: 'm14-1', rule: 'm14', tags: { 'highway': 'footway', 'footway': 'crossing' }, desc: 'LTS 2: highway=footway and footway=crossing'},
  {lts: 2, id: 'm15-1', rule: 'm15', tags: { 'highway': 'track' }, desc: 'LTS 2: highway=track'},
  {lts: 2, id: 'm16-1', rule: 'm16', tags: { 'highway': 'service', 'maxspeed': '30' }, desc: 'LTS 2: highway=service, maxspeed=30'},
  {lts: 1, id: 'm17-1', rule: 'm17', tags: { 'highway': 'primary', 'maxspeed': '60', 'motor_vehicle': 'no' }, desc: 'LTS 1: motor_vehicle=no'},
  {lts: 1, id: 'm17-2', rule: 'm17', tags: { 'highway': 'service', 'service': 'alley', 'motor_vehicle': 'no' }, desc: 'LTS 1: motor_vehicle=no in service alley'}
]

let wintermodel_ways = [
  {lts: 0, id: 'p1-1', rule: 'p1', tags: { 'lanes': '3', 'maxspeed': '40' }, desc: 'Cycling not permitted. No highway tag.'},
  {lts: 0, id: 'p2-1', rule: 'p2', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '40', 'bicycle': 'no' }, desc: 'Cycling not permitted. bicycle=no'},
  {lts: 0, id: 'p3-1', rule: 'p3', tags: { 'highway': 'motorway', 'lanes': '3', 'maxspeed': '40' }, desc: 'Cycling not permitted. highway=motorway'},
  {lts: 0, id: 'p3-2', rule: 'p3', tags: { 'highway': 'motorway', 'maxspeed': '60', 'motor_vehicle': 'no' }, desc: 'LTS 0: highway=motorway, motor_vehicle=no'},
  {lts: 0, id: 'p4-1', rule: 'p4', tags: { 'highway': 'motorway_link', 'lanes': '3', 'maxspeed': '40' }, desc: 'Cycling not permitted. highway=motorway_link'},
  {lts: 0, id: 'p5-1', rule: 'p5', tags: { 'highway': 'footway', 'lanes': '2', 'maxspeed': '40', 'footway': 'sidewalk' }, desc: 'Cycling not permitted. highway=footway and footway=sidewalk'},
  {lts: 0, id: 'p6-1', rule: 'p6', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '40', 'bicycle': 'yes', 'access': 'no' }, desc: 'Cycling not permitted. access=no'},
  {lts: 0, id: 'p7-1', rule: 'wp7', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '30', 'bicycle': 'yes', 'seasonal': 'yes', 'access:conditional': 'no @ (dec-mar)'}, desc: 'Cycling not supported in winter'},
  {lts: 0, id: 'p8-1', rule: 'wp8', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '30', 'bicycle': 'yes', 'seasonal': 'yes', 'access:conditional': 'no @ (nov-feb)'}, desc: 'Cycling not supported in winter. Offset overlap'},
  {lts: 0, id: 'p8-2', rule: 'wp8', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '30', 'bicycle': 'yes', 'seasonal': 'yes', 'access:conditional': 'no @ (jan-may)'}, desc: 'Cycling not supported in winter. Offset overlap'},
  {lts: 0, id: 'p9-1', rule: 'wp9', tags: { 'highway': 'path', 'bicycle': 'yes', 'surface': 'dirt'}, desc: 'Cycling not supported in winter. Path surface.'},
  {lts: 0, id: 'p10-1', rule: 'wp10', tags: { 'highway': 'path', 'path': 'desire', 'bicycle': 'yes'}, desc: 'Cycling not supported in winter. Desire path.'},
  {lts: 1, id: 's1-1', rule: 's1', tags: { 'highway': 'path', 'lanes': '2', 'maxspeed': '40' }, desc: 'Separated Path, highway=path'},
  {lts: 1, id: 's2-1', rule: 's2', tags: { 'highway': 'footway', 'lanes': '2', 'maxspeed': '40' }, desc: 'Separated Path, highway=footway'},
  {lts: 1, id: 's3-1', rule: 's3', tags: { 'highway': 'cycleway', 'lanes': '2', 'maxspeed': '40' }, desc: 'Separated Path, highway=cycleway'},
  {lts: 1, id: 's4-1', rule: 's4', tags: { 'highway': 'construction', 'construction': 'path' }, desc: 'Separated Path, construction path'},
  {lts: 1, id: 's5-1', rule: 's5', tags: { 'highway': 'construction', 'construction': 'footway' }, desc: 'Separated Path, construction footway'},
  {lts: 1, id: 's6-1', rule: 's6', tags: { 'highway': 'construction', 'construction': 'cycleway' }, desc: 'Separated Path, construction cycleway'},
  {lts: 1, id: 's7-1', rule: 's7', tags: { 'highway': 'residential', 'cycleway': 'track', 'maxspeed': '40' }, desc: 'Separated Path, cycleway=track'},
  {lts: 1, id: 's8-1', rule: 's8', tags: { 'highway': 'residential', 'cycleway': 'opposite_track', 'maxspeed': '80' }, desc: 'Separated Path, cycleway=opposite_track, maxspeed=80'},
  {lts: 1, id: 'b1-1', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'crossing', 'maxspeed': '30', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=crossing'},
  {lts: 1, id: 'b1-2', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'parallel' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-3', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'perpendicular' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-4', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'diagonal' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-5', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'yes' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-6', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane': 'marked' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-7', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane:right': 'parallel' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-8', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane:left': 'perpendicular' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 1, id: 'b1-9', rule: 'b1', tags: { 'highway': 'residential', 'cycleway': 'left', 'maxspeed': '30', 'lanes': '1', 'parking:lane:both': 'diagonal' }, desc: 'Bike lane, parking, cycleway=left'},
  {lts: 3, id: 'b2-1', rule: 'b2', tags: { 'highway': 'residential', 'cycleway:middle': 'lane', 'maxspeed': '30', 'lanes': '3', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=middle'},
  {lts: 3, id: 'b2-1', rule: 'b2', tags: { 'highway': 'residential', 'cycleway:middle': 'lane', 'maxspeed': '30', 'lanes': '4', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=middle'},
  // FIXME: No coverage for rule B3, B4, B5 (lane width)
  {lts: 2, id: 'b6-1', rule: 'b6', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2', 'parking': 'yes', 'maxspeed': '41' }, desc: 'Bike lane, parking, cycleway=left, maxspeed=41'},
  {lts: 2, id: 'b6-2', rule: 'b6', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2', 'parking': 'yes', 'maxspeed': '50' }, desc: 'Bike lane, parking, cycleway=left, maxspeed=50'},
  {lts: 2, id: 'b6-3', rule: 'b6', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=left, default maxspeed'},
  {lts: 3, id: 'b7-1', rule: 'b7', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'maxspeed': '51', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=opposite, maxspeed=51'},
  {lts: 3, id: 'b7-2', rule: 'b7', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'maxspeed': '64', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=opposite, maxspeed=64'},
  {lts: 4, id: 'b8-1', rule: 'b8', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'maxspeed': '65', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, parking, cycleway=opposite, maxspeed=65'},
  {lts: 4, id: 'b8-2', rule: 'b8', tags: { 'highway': 'primary', 'cycleway': 'opposite', 'lanes': '1', 'parking': 'yes' }, desc: 'Bike lane, cycleway=opposite, highway=primary, default maxspped'},
  {lts: 1, id: 'c1-1', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'crossing', 'maxspeed': '30', 'lanes': '1' }, desc: 'Bike lane, cycleway=crossing'},
  {lts: 1, id: 'c1-2', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'lane', 'maxspeed': '30', 'lanes': '1' }, desc: 'Bike lane, cycleway=lane'},
  {lts: 1, id: 'c1-3', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'left', 'lanes': '2' }, desc: 'Bike lane, cycleway=left'},
  {lts: 1, id: 'c1-4', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'lanes': '2' }, desc: 'Bike lane, cycleway=left'},
  {lts: 1, id: 'c1-5', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'opposite_lane', 'lanes': '2' }, desc: 'Bike lane, cycleway=opposite_lane'},
  {lts: 1, id: 'c1-6', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'right', 'lanes': '2' }, desc: 'Bike lane, cycleway=right'},
  {lts: 1, id: 'c1-7', rule: 'c1', tags: { 'highway': 'residential', 'cycleway': 'yes', 'lanes': '2' }, desc: 'Bike lane, cycleway=yes'},
  {lts: 1, id: 'c1-8', rule: 'c1', tags: { 'highway': 'residential', 'shoulder:access:bicycle': 'yes', 'lanes': '2' }, desc: 'Bike lane, shoulder:access:bicycle=yes'},
  // FIXME: No coverage for rule C2 (separating median)
  {lts: 3, id: 'c3-1', rule: 'c3', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'lanes': '3' }, desc: 'Bike lane, cycleway=opposite, lanes=3'},
  {lts: 3, id: 'c3-2', rule: 'c3', tags: { 'highway': 'residential', 'cycleway': 'opposite', 'lanes': '4' }, desc: 'Bike lane, cycleway=opposite, lanes=4'},
  // FIXME: No coverage for rule C4 (lane width)
  {lts: 3, id: 'c5-1', rule: 'c5', tags: { 'highway': 'residential', 'cycleway:both': 'lane', 'maxspeed': '51' }, desc: 'Bike lane, maxspeed=51'},
  {lts: 3, id: 'c5-2', rule: 'c5', tags: { 'highway': 'residential', 'cycleway:middle': 'lane', 'maxspeed': '64' }, desc: 'Bike lane, maxspeed=64'},
  {lts: 4, id: 'c6-1', rule: 'c6', tags: { 'highway': 'residential', 'cycleway:left': 'lane', 'maxspeed': '65' }, desc: 'Bike lane, maxspeed=65'},
  {lts: 4, id: 'c6-2', rule: 'c6', tags: { 'highway': 'residential', 'cycleway:right': 'lane', 'maxspeed': '100' }, desc: 'Bike lane, maxspeed=100'},
  {lts: 4, id: 'c6-3', rule: 'c6', tags: { 'highway': 'secondary', 'cycleway:right': 'lane' }, desc: 'Bike lane, highway=seconary, maxspeed 66+ (default)'},
  {lts: 3, id: 'c7-1', rule: 'c7', tags: { 'highway': 'tertiary', 'cycleway': 'opposite_lane' }, desc: 'Bike lane, non-residential lowspeed'},
  {lts: 1, id: 'm1-1', rule: 'm1', tags: { 'highway': 'steps' }, desc: 'LTS 1: highway=steps.'},
  {lts: 2, id: 'm2-1', rule: 'm2', tags: { 'highway': 'service', 'service': 'alley' }, desc: 'LTS 2: highway=service and service=alley.'},
  {lts: 2, id: 'm3-1', rule: 'm3', tags: { 'highway': 'service', 'service': 'parking_aisle' }, desc: 'LTS 2: highway=service and service=parking_aisle.'},
  {lts: 2, id: 'm4-1', rule: 'm4', tags: { 'highway': 'service', 'service': 'driveway' }, desc: 'LTS 2: highway=service and service=parking_aisle.'},
  {lts: 2, id: 'm5-1', rule: 'm5', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 2, id: 'm5-2', rule: 'm5', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 2, id: 'm5-3', rule: 'm5', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm6-1', rule: 'm6', tags: { 'highway': 'tertiary', 'lanes': '2', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm6-2', rule: 'm6', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm6-3', rule: 'm6', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential, maxspeed=40'},
  {lts: 3, id: 'm7-1', rule: 'm7', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm7-2', rule: 'm7', tags: { 'highway': 'residential', 'lanes': '5', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 3, id: 'm7-3', rule: 'm7', tags: { 'highway': 'residential', 'lanes': '5', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential'},
  {lts: 4, id: 'm8-1', rule: 'm8', tags: { 'highway': 'residential', 'lanes': '6', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 4, id: 'm8-2', rule: 'm8', tags: { 'highway': 'residential', 'lanes': '6', 'maxspeed': '30' }, desc: 'Mixed traffic, highway=residential, maxspeed=30'},
  {lts: 4, id: 'm8-3', rule: 'm8', tags: { 'highway': 'residential', 'lanes': '7', 'maxspeed': '40' }, desc: 'Mixed traffic, highway=residential, maxspeed=40'},
  {lts: 2, id: 'm9-1', rule: 'm9', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 2, id: 'm9-2', rule: 'm9', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=residential, maxspeed=49'},
  {lts: 2, id: 'm9-3', rule: 'm9', tags: { 'highway': 'residential', 'lanes': '2', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=residential, maxspeed=50'},
  {lts: 3, id: 'm10-1', rule: 'm10', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 3, id: 'm10-2', rule: 'm10', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=residential, maxspeed=49'},
  {lts: 3, id: 'm10-3', rule: 'm10', tags: { 'highway': 'residential', 'lanes': '3', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=residential, maxspeed=50'},
  {lts: 3, id: 'm10-4', rule: 'm10', tags: { 'highway': 'tertiary', 'lanes': '2', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=41'},
  {lts: 3, id: 'm10-5', rule: 'm10', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=49'},
  {lts: 3, id: 'm10-6', rule: 'm10', tags: { 'highway': 'tertiary', 'lanes': '3', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=50'},
  {lts: 3, id: 'm10-7', rule: 'm10', tags: { 'highway': 'secondary', 'lanes': '2', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 4, id: 'm11-1', rule: 'm11', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=residential, maxspeed=41'},
  {lts: 4, id: 'm11-2', rule: 'm11', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=residential, maxspeed=49'},
  {lts: 4, id: 'm11-3', rule: 'm11', tags: { 'highway': 'residential', 'lanes': '4', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=residential, maxspeed=50'},
  {lts: 4, id: 'm11-4', rule: 'm11', tags: { 'highway': 'tertiary', 'lanes': '5', 'maxspeed': '41' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=41'},
  {lts: 4, id: 'm11-5', rule: 'm11', tags: { 'highway': 'tertiary', 'lanes': '5', 'maxspeed': '49' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=49'},
  {lts: 4, id: 'm11-6', rule: 'm11', tags: { 'highway': 'tertiary', 'lanes': '5', 'maxspeed': '50' }, desc: 'Mixed traffic, highway=tertiary, maxspeed=50'},
  {lts: 4, id: 'm12-1', rule: 'm12', tags: { 'highway': 'residential', 'lanes': '1', 'maxspeed': '51' }, desc: 'Mixed traffic, highway=residential, lanes=4'},
  {lts: 4, id: 'm12-2', rule: 'm12', tags: { 'highway': 'primary', 'lanes': '1', 'maxspeed': '51' }, desc: 'Mixed traffic, maxspeed 51+'},
  {lts: 4, id: 'm12-3', rule: 'm12', tags: { 'highway': 'primary', 'lanes': '1' }, desc: 'Mixed traffic, default maxspeed on primary highway'},
  {lts: 1, id: 'm13-1', rule: 'm13', tags: { 'highway': 'pedestrian' }, desc: 'LTS 1: highway=pedestrian'},
  {lts: 2, id: 'm14-1', rule: 'm14', tags: { 'highway': 'footway', 'footway': 'crossing' }, desc: 'LTS 2: highway=footway and footway=crossing'},
  {lts: 2, id: 'm15-1', rule: 'm15', tags: { 'highway': 'track' }, desc: 'LTS 2: highway=track'},
  {lts: 2, id: 'm16-1', rule: 'm16', tags: { 'highway': 'service', 'maxspeed': '30' }, desc: 'LTS 2: highway=service, maxspeed=30'},
  {lts: 1, id: 'm17-1', rule: 'm17', tags: { 'highway': 'primary', 'maxspeed': '60', 'motor_vehicle': 'no' }, desc: 'LTS 1: motor_vehicle=no'},
  {lts: 1, id: 'm17-2', rule: 'm17', tags: { 'highway': 'service', 'service': 'alley', 'motor_vehicle': 'no' }, desc: 'LTS 1: motor_vehicle=no in service alley'}
]

test('Stressmodel General Tests', (assert) => {
  assert.equal(stressmodel.name, 'default', 'g1 - Name matches \'default\'')
  assert.equal(stressmodel.levels, 4, 'g2 - Number of levels=4')
  assert.equal(typeof stressmodel.description, 'string', 'g3 - Description must be a string.')
  assert.end()
})

test('Wintermodel General Tests', (assert) => {
  assert.equal(wintermodel.name, 'winter', 'g1 - Name matches \'winter\'')
  assert.equal(wintermodel.levels, 4, 'g2 - Number of levels=4')
  assert.equal(typeof wintermodel.description, 'string', 'g3 - Description must be a string.')
  assert.end()
})

test('Stressmodel Case Tests', (assert) => {
  let model_ways = stressmodel_ways
  let model = stressmodel
  for (let i = 0; i < model_ways.length; i++) {
    let w = model_ways[i]
    let way = { id: w.rule, tags: w.tags }
    let result = model.evaluateLTS(way)
    assert.equal(result.lts, w.lts, 'Check result (' + w.id + '): ' + w.desc)
    assert.equal(result.rule, w.rule, 'Check rule (' + w.id + '): ' + w.desc)
  }
  assert.end()
})

test('Wintermodel Case Tests', (assert) => {
  let model_ways = wintermodel_ways
  let model = wintermodel
  for (let i = 0; i < model_ways.length; i++) {
    let w = model_ways[i]
    let way = { id: w.rule, tags: w.tags }
    let result = model.evaluateLTS(way)
    assert.equal(result.lts, w.lts, 'Check result (' + w.id + '): ' + w.desc)
    assert.equal(result.rule, w.rule, 'Check rule (' + w.id + '): ' + w.desc)
  }
  assert.end()
})