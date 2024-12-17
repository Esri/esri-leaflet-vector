# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Upcoming changes][unreleased]

### Updated

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `4.7.1`.

## [4.2.6] - 2024-12-17

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `4.6.0`.

### Fixed

* Fixed issue where Esri Attribution was not added properly when using vectorBasemapLayer using an item ID ([#229](https://github.com/Esri/esri-leaflet-vector/pull/229))

## [4.2.5] - 2024-08-26

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `4.6.0`.

## [4.2.4] - 2024-08-21

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `4.5.0`.

### Fixed

* Fixed issue where Esri Attribution was not removed when VectorBasemapLayer was removed ([#208](https://github.com/Esri/esri-leaflet-vector/pull/208))

### Updated

* Updated maplibre-gl dependency to v4 ([#219](https://github.com/Esri/esri-leaflet-vector/pull/219))
* Updated dependencies ([#223](https://github.com/Esri/esri-leaflet-vector/pull/223))

## [4.2.3] - 2023-12-07

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `3.3.1`.

### Added

* Added worldview and places params ([#214](https://github.com/Esri/esri-leaflet-vector/pull/214))

### Fixed

* Fixed `wrong listener type: undefined` console warning ([#211](https://github.com/Esri/esri-leaflet-vector/pull/211))

## [4.2.2] - 2023-10-23

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `3.3.1`.

### Fixed

* Adds support for RTL language labels by exposing the maplibre `setRTLTextPlugin` method ([#207](https://github.com/Esri/esri-leaflet-vector/pull/207))

## [4.2.1] - 2023-10-18

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `3.3.1`.

### Updated

* Updated maplibre-gl dependency to v3 ([#201](https://github.com/Esri/esri-leaflet-vector/pull/201))

## [4.2.0] - 2023-10-17

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `2.3.0`.

### Added

* Allow users to set preserveDrawingBuffer in the options ([#199](https://github.com/Esri/esri-leaflet-vector/pull/199))
* Expose MaplibreGLJSLayer variable ([#197](https://github.com/Esri/esri-leaflet-vector/pull/197))

### Fixed

* Token with sprite and glyphs ([#192](https://github.com/Esri/esri-leaflet-vector/pull/192))
* Export of package version ([#187](https://github.com/Esri/esri-leaflet-vector/pull/187))

## [4.1.0] - 2023-05-31

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `2.3.0`.

### Added

* Added `load-error` event ([#165](https://github.com/Esri/esri-leaflet-vector/pull/165))
* Added support for the v2 basemap styles service ([#182](https://github.com/Esri/esri-leaflet-vector/pull/182))

### Fixed

* fix default pane for VectorBasemapLayer ([#182](https://github.com/Esri/esri-leaflet-vector/pull/182))

### Changed

* VectorBasemapLayer now inherits from VectorTileLayer, reducing code duplication within this repo. ([#182](https://github.com/Esri/esri-leaflet-vector/pull/182))

## [4.0.2] - 2023-04-04

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `2.3.0`.

### Fixed

* Fixed layer invisible at certain zoom levels using minLOD/maxLOD ([#166](https://github.com/Esri/esri-leaflet-vector/pull/166))
* Added `index.d.ts` to release ([#167](https://github.com/Esri/esri-leaflet-vector/pull/167))

## [4.0.1] - 2023-02-23

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `2.3.0`.

### Fixed

* Switching basemaps issue ([#162](https://github.com/Esri/esri-leaflet-vector/pull/162))

### Updated

* Updated dependencies ([#163](https://github.com/Esri/esri-leaflet-vector/pull/163))

## [4.0.0] - 2022-09-02

MapLibre GL JS version that is included with this version of Esri Leaflet Vector: `2.3.0`.

### Updated

* Switched to use Maplibre GL JS ([#141](https://github.com/Esri/esri-leaflet-vector/pull/141))

## [3.1.5] - 2022-08-23

### Fixed

* Fixed issue where layer is mis-aligned with map when panning the map off screen  ([#144](https://github.com/Esri/esri-leaflet-vector/pull/144))

### Updated

* Updated dependencies

## [3.1.4] - 2022-08-12

### Fixed

* Added "Powered by Esri" when adding a layer via item ID for consistency ([#135](https://github.com/Esri/esri-leaflet-vector/pull/135))

## [3.1.3] - 2022-05-23

### Fixed

* Offset issue when zooming out to levels 0 or 1 ([#127](https://github.com/Esri/esri-leaflet-vector/pull/127))

### Updated

* Updated dependencies

## [3.1.2] - 2022-03-03

### Added

* TypeScript types file ([#114](https://github.com/Esri/esri-leaflet-vector/pull/114))

### Updated

* Updated dependencies and changed build-related settings to be consistent with Esri Leaflet ([#122](https://github.com/Esri/esri-leaflet-vector/pull/122))

## [3.1.1] - 2021-11-09

### Fixed

* Map panning was broken in some environments due to a specific `mapbox-gl-js` version. Pinning this library's `package.json` specifically to `mapbox-gl-js v1.13.1` fixes the issue. [#105](https://github.com/Esri/esri-leaflet-vector/pull/105)

## [3.1.0] - 2021-08-09

### Added

* `L.esri.Vector.vectorTileLayer` has been extended to support vector tiles layers hosted in ArcGIS Enterprise. A new `portalUrl` layer constructor option was added and is intended to be used with the "ITEM_ID" constructor flavor. [#97](https://github.com/Esri/esri-leaflet-vector/pull/97)

* New README documentation and a developer console warning for `L.esri.Vector.vectorTileLayer` explaining that only services with a Web Mercator `spatialReference` are fully supported. [#95](https://github.com/Esri/esri-leaflet-vector/pull/95)

* Updated peerDependencies to be more flexible for using v3 of `esri-leaflet`. [#99](https://github.com/Esri/esri-leaflet-vector/pull/99)

### Fixed

* Utility functions used by `L.esri.Vector.vectorTileLayer` have been improved to be more friendly with URL structures and style reformatting assumptions. [#100](https://github.com/Esri/esri-leaflet-vector/pull/100)

## [3.0.1] - 2021-06-03

### Fixed

* While formatting the style object when loading a new `L.esri.Vector.vectorTileLayer`, check first if layer layout property exists before accessing. (🙏jag-eagle-technology🙏 [#70](https://github.com/Esri/esri-leaflet-vector/pull/70))

* Support style items with non-esri source names. [#91](https://github.com/Esri/esri-leaflet-vector/pull/91)

### Changed

* The layer constructor option `apikey` in all lowercase is now supported **and encouraged** in order  to be consistent with the rest of esri-leaflet's ecosystem. Note that camel case `apiKey` continues to be allowed since [3.0.0]. [#89](https://github.com/Esri/esri-leaflet-vector/pull/89)

## [3.0.0] - 2021-01-25

### Breaking

* `L.esri.Vector.basemap` is now `L.esri.Vector.vectorBasemapLayer` and requires an API key (`apiKey`) or token (`token`).
* `L.esri.Vector.layer` is now `L.esri.Vector.vectorTileLayer`.
* Simplified imports. `mapbox-gl-js v1` continues to be a depedency but is bundled internally with production builds.

  ```html
  <!-- Leaflet -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

  <!-- Esri Leaflet and Esri Leaflet Vector -->
  <script src="https://unpkg.com/esri-leaflet/dist/esri-leaflet.js"></script>
  <script src="https://unpkg.com/esri-leaflet-vector@3/dist/esri-leaflet-vector.js"></script>
  ```

## [2.0.2]

### Added

* New basemaps! 🙏pmacMaps🙏
  * `DarkHumanGeography`
  * `DarkHumanGeographyDetail`
  * `ChartedTerritory`
  * `MidCentury`
  * `Nova`

## [2.0.1]

### Fixed

* Added support for deeper zoom by artificially capping tile requests at zoom level 15.

## [2.0.0]

### Changed

* Existing basemaps have been updated to [`v2`](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/mapping/whats-new-in-esri-vector-basemaps-december-2017/)

### Added

* Esri's [OpenStreetMap Vector basemap](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/mapping/new-osm-vector-basemap/)

### Breaking Change

* `mapbox-gl-js` is now an external dependency. it is no longer bundled internally.

```html
<link rel="stylesheet" href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css"/>
<script src="https://unpkg.com/mapbox-gl/dist/mapbox-gl.js"></script>

<!-- Esri Leaflet -->
<script src="https://unpkg.com/esri-leaflet/dist/esri-leaflet.js"></script>
<script src="https://unpkg.com/esri-leaflet-vector/dist/esri-leaflet-vector.js"></script>
```

## [1.0.7]

### Fixed

* several edge cases that corrupted the current state of the map

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

[unreleased]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.6...HEAD
[4.2.6]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.5...v4.2.6
[4.2.5]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.4...v4.2.5
[4.2.4]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.3...v4.2.4
[4.2.3]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.2...v4.2.3
[4.2.2]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.1...v4.2.2
[4.2.1]: https://github.com/esri/esri-leaflet-vector/compare/v4.2.0...v4.2.1
[4.2.0]: https://github.com/esri/esri-leaflet-vector/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/esri/esri-leaflet-vector/compare/v4.0.2...v4.1.0
[4.0.2]: https://github.com/esri/esri-leaflet-vector/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/esri/esri-leaflet-vector/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/esri/esri-leaflet-vector/compare/v3.1.5...v4.0.0
[3.1.4]: https://github.com/esri/esri-leaflet-vector/compare/v3.1.3...v3.1.4
[3.1.3]: https://github.com/esri/esri-leaflet-vector/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/esri/esri-leaflet-vector/compare/v3.1.0...v3.1.2
[3.1.1]: https://github.com/esri/esri-leaflet-vector/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/esri/esri-leaflet-vector/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/esri/esri-leaflet-vector/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/esri/esri-leaflet-vector/compare/v2.0.2...v3.0.0
[2.0.2]: https://github.com/esri/esri-leaflet-vector/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/esri/esri-leaflet-vector/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.7...v2.0.0
[1.0.7]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/esri/esri-leaflet-vector/compare/v1.0.0...v1.0.1
