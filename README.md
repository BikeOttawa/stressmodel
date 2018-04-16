# Cycling Level of Traffic Stress Model

This is a console application that takes an OSM file and performs an analysis on the ways (streets) based on the information stored in their tags. The arguments are as follows:

 `node main.js -f osmfilename -d outputpath [-p prefix][-v][-z]`
 
 where:
 
 * osmfilename   is the path to an OSM file to be processed.
 * outputpath    is the directory where the output files will be created.
 * prefix        is the prefix to be appended to the start of the output filename. The default is 'level_'.
 * -v            requests verbose output to the console.
 * -z            requests that a level 0 file also be generated that includes the highways where cycling is not permitted.
  
See the usage output for an up-to-date list of options.

## Installation
Clone and install dependencies: 
```
git clone https://github.com/BikeOttawa/stressmodel.git
cd stressmodel
npm install
```

 ## Example ##
 
 `node main.js -f ~\maps\myosmfile.osm -d \var\www\stressmap\data -p lts_ -z`
 
 will analyze the specified OSM file and produce 4 output files in geojson format in the \var\www\stressmap\data directory. The files will be named lts_1.json, lts_2.json, lts_3.json and lts_4.json and each will contain the streets for the corresponding LTS level (1-4). An additional file called lts_0.json will be generated that includes non-cycling highways.
 
 If you are using [stressmap](https://github.com/rcmc2020/stressmap) to display the files, you should generate the files with the default value for the prefix "level_". This data should be placed in the app/data directory. For more information, see the documentation for stressmap.
