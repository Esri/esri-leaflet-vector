# Esri Leaflet Vector Basemap Proof-of-Concept

This is a proof of concept for using the [ArcGIS Online Vector Basemaps](http://www.arcgis.com/home/group.html?id=30de8da907d240a0bccd5ad3ff25ef4a&focus=layers) with [Esri Leaflet](https://github.com/Esri/esri-leaflet). It uses https://github.com/patrickarlt/mapbox-gl-leaflet/tree/leaflet-master which is a fork of https://github.com/mapbox/mapbox-gl-leaflet updated for Leaflet 1.0.0 and a custom fork of [mapbox-gl-js](https://github.com/patrickarlt/mapbox-gl-js/tree/esri-leaflet-renderer) which is based off of https://github.com/Esri/mapbox-gl-js/tree/indexed-vector-sources and https://github.com/Esri/vector-tile-js/tree/clipping-logic.

## Caveats

* Mostly untested. Works against the basemap styles listed at https://developers.arcgis.com/javascript/beta/api-reference/esri-layers-VectorTileLayer.html#url
* No proper handling of attribution

## Instructions

1. Fork and then clone the repo.
2. Open `index.html`

## Resources

* [mapbox-gl-js fork](https://github.com/patrickarlt/mapbox-gl-leaflet/tree/leaflet-master)
* [mapbox-gl-leaflet fork](https://github.com/patrickarlt/mapbox-gl-js/tree/esri-leaflet-renderer)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/quickstart-map-js/master/license.txt) file.

[](Esri Tags: Leaflet)
[](Esri Language: JavaScript)​