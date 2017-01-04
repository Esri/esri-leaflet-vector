# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Upcoming changes][unreleased]

## [1.0.6]

### Changed

* now using Esri's latest and greatest basemaps

### Fixed

* Ensure that when a tileMap is present in an ArcGIS Pro published tileset, that its url is concatenated correctly [#20](https://github.com/Esri/esri-leaflet-vector/issues/20)

## [1.0.5]

### Fixed

* Fixed a regression which caused `L.esri.Vector.Layer` not to honor custom styles applied to generic Esri hosted vector tilesets (example [item](http://www.arcgis.com/home/item.html?id=bd505ce3efff479bb4e87b182f180159))

## [1.0.4]

### Added

* `L.esri.Vector.layer` can now be used to display Vector Tile Services published using ArcGIS Pro.  (like [this one](http://www.arcgis.com/home/item.html?id=0bac0ffdc8634d9a9bc662bb8fa7547d))

## [1.0.3]

### Added

* `L.esri.Vector.layer` object added so that developers can point at any arbitrary ArcGIS Online hosted vector tile source

### Fixed

* trapped situation in which vector style json defines path of sprites/glyphs using fully qualified paths.

### Changed

* made dependency on Leaflet fixed at `1.0.0-beta.2` (until [#47](https://github.com/mapbox/mapbox-gl-leaflet/issues/47) is resolved)
* started linting all the `.js` in the repo

## [1.0.2]

### Fixed

* Added three new Vector basemaps.  [Mid-Century](http://www.arcgis.com/home/item.html?id=763884983d3544c0a418a97992881fce), [Newspaper](http://www.arcgis.com/home/item.html?id=4f4843d99c34436f82920932317893ae) and [Spring](http://www.arcgis.com/home/item.html?id=267f44f08a844c7abee2b62b00600540).

## [1.0.1]

### Fixed

* added .npmignore file to ensure built library is included in npm package.

## 1.0.0

### Added

* Initial Release

[unreleased]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.6...HEAD
[1.0.5]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.0...v1.0.1
