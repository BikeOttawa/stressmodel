# Cycling Level of Traffic Stress Model

This is a console application that takes an OSM file and performs an analysis on the ways (streets) based on the information stored in their tags. The arguments are as follows:

```
node main.js -f osmfilename -d outputpath [-m model][-n][-p prefix][-v][-z]
```
 
 where:
 
 * model         is either stressmodel or wintermodel. The default is stressmodel.
 * osmfilename   is the path to an OSM file to be processed.
 * outputpath    is the directory where the output files will be created.
 * prefix        is the prefix to be appended to the start of the output filename. The default is 'level_'.
 * -n            requests that the way names be included in the output.
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

``` 
node main.js -f ~/maps/myosmfile.osm -d /var/www/stressmap/data -p lts_ -z
```
 
 will analyze the specified OSM file using the default stressmodel and will produce 4 output files in geojson format in the /var/www/stressmap/data directory. The files will be named lts_1.json, lts_2.json, lts_3.json and lts_4.json and each will contain the streets for the corresponding LTS level (1-4). An additional file called lts_0.json will be generated that includes non-cycling highways.
 
 If you are using [stressmap](https://github.com/rcmc2020/stressmap) to display the files, you should generate the files with the default value for the prefix "level_". This data should be placed in the app/data directory. For more information, see the documentation for stressmap.

 ## OSM Data ##

To obtain OSM data, you will need a query that describes the values you want. This is the query used by Bike Ottawa for its mapping project:

```
[timeout:600][maxsize:2000000000][bbox:44.927,-76.361,45.598,-75.052];
(
  way["barrier"];
  node(w)->.b;
  (way["highway"]; - way[footway="sidewalk"];);
  node(w)->.h;
  (way[footway="sidewalk"][bicycle]; - way[footway="sidewalk"][bicycle="no"];);
  node(w)->.s;
  node.b.h.s;
);
out;
```

The bbox parameter marks the outer boundary of the area to be retrieved as lat/long coordinates. More information on how to construct queries can be found on the [Overpass API/Language Guide](https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide). There is also a web based query tool called [Overpass  Turbo](https://wiki.openstreetmap.org/wiki/Overpass_turbo) that provides an excellent way to refine and test your queries.

Once your query is working, the [Overpass  Turbo](https://wiki.openstreetmap.org/wiki/Overpass_turbo) tool can be used to download OSM data. If you want to automate the process, you can use the following example:

```
wget -nv -O ~/maps/myosmfile.osm --post-file=~/maps/myosmfile.query "http://overpass-api.de/api/interpreter"
```

This uses the query saved in ~/maps/myosmfile.query to download the required values to ~/maps/myosmfile.osm.   If wget is unavailable, the `curl` utility may also be used on some operating systems.
