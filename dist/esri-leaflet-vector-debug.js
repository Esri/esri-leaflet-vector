/* esri-leaflet-vector - v4.3.1 - Thu Sep 04 2025 12:15:35 GMT-0500 (Central Daylight Time)
 * Copyright (c) 2025 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('esri-leaflet'), require('leaflet'), require('maplibre-gl')) :
  typeof define === 'function' && define.amd ? define(['exports', 'esri-leaflet', 'leaflet', 'maplibre-gl'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.L = global.L || {}, global.L.esri = global.L.esri || {}, global.L.esri.Vector = {}), global.L.esri, global.L, global.maplibregl));
})(this, (function (exports, esriLeaflet, leaflet, maplibregl) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var maplibregl__default = /*#__PURE__*/_interopDefaultLegacy(maplibregl);

  var name = "esri-leaflet-vector";
  var description = "Esri vector basemap and vector tile layer plugin for Leaflet.";
  var version$1 = "4.3.1";
  var author = "John Gravois (https://johngravois.com)";
  var contributors = [
  	"Patrick Arlt <parlt@esri.com> (http://patrickarlt.com)",
  	"Gavin Rehkemper <grehkemper@esri.com> (https://gavinr.com)",
  	"Jacob Wasilkowski (https://jwasilgeo.github.io)",
  	"George Owen (https://geowen.dev/)"
  ];
  var bugs = {
  	url: "https://github.com/Esri/esri-leaflet-vector/issues"
  };
  var peerDependencies = {
  	"esri-leaflet": ">2.3.0",
  	leaflet: "^1.5.0",
  	"maplibre-gl": "^2.0.0 || ^3.0.0 || ^4.0.0"
  };
  var devDependencies = {
  	"@rollup/plugin-commonjs": "^24.0.1",
  	"@rollup/plugin-json": "^6.0.0",
  	"@rollup/plugin-node-resolve": "^15.0.1",
  	"@rollup/plugin-terser": "^0.3.0",
  	chai: "4.3.7",
  	"chokidar-cli": "^3.0.0",
  	eslint: "^9.24.0",
  	"eslint-config-mourner": "^4.0.2",
  	"eslint-config-prettier": "^10.1.2",
  	"eslint-plugin-import-x": "^4.10.2",
  	"esri-leaflet": "^3.0.0",
  	"gh-release": "^7.0.2",
  	"http-server": "^14.1.1",
  	karma: "^6.4.1",
  	"karma-chrome-launcher": "^3.1.0",
  	"karma-coverage": "^2.2.0",
  	"karma-edgium-launcher": "github:matracey/karma-edgium-launcher",
  	"karma-firefox-launcher": "^2.1.2",
  	"karma-mocha": "^2.0.1",
  	"karma-mocha-reporter": "^2.2.5",
  	"karma-safari-launcher": "~1.0.0",
  	"karma-sinon-chai": "^2.0.2",
  	"karma-sourcemap-loader": "^0.3.8",
  	leaflet: "^1.5.0",
  	mkdirp: "^2.1.3",
  	mocha: "^10.2.0",
  	"npm-run-all": "^4.1.5",
  	prettier: "3.5.3",
  	rollup: "^2.79.1",
  	sinon: "^15.0.1",
  	"sinon-chai": "3.7.0"
  };
  var files = [
  	"src/**/*.js",
  	"dist/*.js",
  	"dist/*.js.map",
  	"dist/*.json",
  	"index.d.ts"
  ];
  var homepage = "https://github.com/Esri/esri-leaflet-vector#readme";
  var jspm = {
  	registry: "npm",
  	format: "es6",
  	main: "src/EsriLeafletVector.js"
  };
  var keywords = [
  	"maplibre",
  	"arcgis",
  	"leaflet",
  	"leafletjs",
  	"maps"
  ];
  var license = "Apache-2.0";
  var main = "dist/esri-leaflet-vector-debug.js";
  var module = "src/EsriLeafletVector.js";
  var browser = "dist/esri-leaflet-vector-debug.js";
  var types = "index.d.ts";
  var readmeFilename = "README.md";
  var repository = {
  	type: "git",
  	url: "git+https://github.com/Esri/esri-leaflet-vector.git"
  };
  var scripts = {
  	prebuild: "mkdirp dist",
  	build: "rollup -c profiles/debug.js & rollup -c profiles/production.js",
  	"build-dev": "rollup -c profiles/debug.js",
  	lint: "npm run eslint && npm run prettier",
  	eslint: "eslint .",
  	eslintfix: "npm run eslint -- --fix",
  	prettier: "npx prettier . --check",
  	prettierfix: "npx prettier . --write",
  	"start-watch": "chokidar src -c \"npm run build\"",
  	"start-watch-dev": "chokidar src -c \"npm run build-dev\"",
  	start: "run-p start-watch serve",
  	"start-dev": "run-p start-watch-dev serve",
  	dev: "npm run start-dev",
  	serve: "http-server -p 8765 -c-1 -o",
  	pretest: "npm run build-dev",
  	test: "npm run lint && karma start",
  	release: "./scripts/release.sh"
  };
  var packageInfo = {
  	name: name,
  	description: description,
  	version: version$1,
  	author: author,
  	contributors: contributors,
  	bugs: bugs,
  	peerDependencies: peerDependencies,
  	devDependencies: devDependencies,
  	files: files,
  	homepage: homepage,
  	"jsnext:main": "src/EsriLeafletVector.js",
  	jspm: jspm,
  	keywords: keywords,
  	license: license,
  	main: main,
  	module: module,
  	browser: browser,
  	types: types,
  	readmeFilename: readmeFilename,
  	repository: repository,
  	scripts: scripts
  };

  /*
    utility to establish a URL for the basemap styles API
    used primarily by VectorBasemapLayer.js
  */
  function getBasemapStyleUrl(style, apikey) {
    if (style.includes("/")) {
      throw new Error(
        `${style} is a v2 style enumeration. Set version:2 to request this style`,
      );
    }

    let url = `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${style}?type=style`;
    if (apikey) {
      url = `${url}&token=${apikey}`;
    }
    return url;
  }

  /**
   * Utility to establish a URL for the basemap styles API v2
   *
   * @param {string} style
   * @param {string} token
   * @param {Object} [options] Optional list of options: language, worldview, or places.
   * @returns {string} the URL
   */
  function getBasemapStyleV2Url(style, token, options) {
    if (style.startsWith("osm/")) {
      console.log(
        "L.esri.Vector.vectorBasemapLayer: All 'osm/*' styles are retired are no longer receiving updates and were last updated in 2024. Please use 'open/*' styles instead.",
      );
    }

    if (style.includes(":")) {
      throw new Error(
        `${style} is a v1 style enumeration. Set version:1 to request this style`,
      );
    }

    let url =
      options.baseUrl ||
      "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/";

    if (
      !(
        style.startsWith("open/") ||
        style.startsWith("osm/") ||
        style.startsWith("arcgis/")
      ) &&
      style.length === 32
    ) {
      // style is an itemID
      url = `${url}items/${style}`;

      if (options.language) {
        throw new Error(
          "The 'language' parameter is not supported for custom basemap styles",
        );
      }
    } else {
      url = url + style;
    }

    if (!token) {
      throw new Error("A token is required to access basemap styles.");
    }

    url = `${url}?token=${token}`;
    if (options.language) {
      url = `${url}&language=${options.language}`;
    }
    if (options.worldview) {
      url = `${url}&worldview=${options.worldview}`;
    }
    if (options.places) {
      url = `${url}&places=${options.places}`;
    }
    return url;
  }
  /*
    utilities to communicate with custom user styles via an ITEM ID or SERVICE URL
    used primarily by VectorTileLayer.js
  */
  function loadStyle(idOrUrl, options, callback) {
    const httpRegex = /^https?:\/\//;
    const serviceRegex = /\/VectorTileServer\/?$/;

    if (httpRegex.test(idOrUrl) && serviceRegex.test(idOrUrl)) {
      const serviceUrl = idOrUrl;
      loadStyleFromService(serviceUrl, options, callback);
    } else {
      const itemId = idOrUrl;
      loadStyleFromItem(itemId, options, callback);
    }
  }

  function loadService(serviceUrl, options, callback) {
    const params = options.token ? { token: options.token } : {};
    esriLeaflet.request(serviceUrl, params, callback);
  }

  function loadItem(itemId, options, callback) {
    const params = options.token ? { token: options.token } : {};
    const url = `${options.portalUrl}/sharing/rest/content/items/${itemId}`;
    esriLeaflet.request(url, params, callback);
  }

  function loadStyleFromItem(itemId, options, callback) {
    const itemStyleUrl = toCdnUrl(
      `${options.portalUrl}/sharing/rest/content/items/${
      itemId
    }/resources/styles/root.json`,
    );

    loadStyleFromUrl(itemStyleUrl, options, (error, style) => {
      if (error) {
        loadItem(itemId, options, (error, item) => {
          if (error) {
            callback(error);
            return;
          }
          loadStyleFromService(item.url, options, callback);
        });
      } else {
        loadItem(itemId, options, (error, item) => {
          if (error) {
            callback(error);
            return;
          }
          loadService(item.url, options, (error, service) => {
            callback(error, style, itemStyleUrl, service, item.url);
          });
        });
      }
    });
  }

  function loadStyleFromService(serviceUrl, options, callback) {
    loadService(serviceUrl, options, (error, service) => {
      if (error) {
        callback(error);
        return;
      }

      let sanitizedServiceUrl = serviceUrl;
      // a trailing "/" may create invalid paths
      if (serviceUrl.charAt(serviceUrl.length - 1) === "/") {
        sanitizedServiceUrl = serviceUrl.slice(0, serviceUrl.length - 1);
      }

      let defaultStylesUrl;
      // inadvertently inserting more than 1 adjacent "/" may create invalid paths
      if (service.defaultStyles.charAt(0) === "/") {
        defaultStylesUrl = `${sanitizedServiceUrl + service.defaultStyles}/root.json`;
      } else {
        defaultStylesUrl = `${sanitizedServiceUrl}/${service.defaultStyles}/root.json`;
      }

      loadStyleFromUrl(defaultStylesUrl, options, (error, style) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null, style, defaultStylesUrl, service, serviceUrl);
      });
    });
  }

  function loadStyleFromUrl(styleUrl, options, callback) {
    const params = options.token ? { token: options.token } : {};
    esriLeaflet.request(styleUrl, params, callback);
  }

  function isSameTLD(url1, url2) {
    return new URL(url1).hostname === new URL(url2).hostname;
  }

  /**
   * Converts an ArcGIS Online URL to a CDN URL to reduce latency and server load. This will not
   * convert a ArcGIS Enterprise URL since they will be hosting their own resources.
   *
   * Borrowed from the JS API.
   */
  function toCdnUrl(url) {
    if (!url) {
      return url || null;
    }

    let outUrl = url;

    if (outUrl) {
      outUrl = normalizeArcGISOnlineOrgDomain(outUrl);
      outUrl = outUrl.replace(
        /^https?:\/\/www\.arcgis\.com/,
        "https://cdn.arcgis.com",
      );
      outUrl = outUrl.replace(
        /^https?:\/\/devext\.arcgis\.com/,
        "https://cdndev.arcgis.com",
      );
      outUrl = outUrl.replace(
        /^https?:\/\/qaext\.arcgis\.com/,
        "https://cdnqa.arcgis.com",
      );
    }

    return outUrl;
  }

  /**
   * Replaces the AGOL org domains with non-org domains.
   *
   * Borrowed from the JS API.
   */
  function normalizeArcGISOnlineOrgDomain(url) {
    const prdOrg = /^https?:\/\/(?:cdn|[a-z\d-]+\.maps)\.arcgis\.com/i; // https://cdn.arcgis.com or https://x.maps.arcgis.com
    const devextOrg =
      /^https?:\/\/(?:cdndev|[a-z\d-]+\.mapsdevext)\.arcgis\.com/i; // https://cdndev.arcgis.com or https://x.mapsdevext.arcgis.com
    const qaOrg = /^https?:\/\/(?:cdnqa|[a-z\d-]+\.mapsqa)\.arcgis\.com/i; // https://cdnqa.arcgis.com or https://x.mapsqa.arcgis.com

    // replace AGOL org domains with non-org domains
    if (prdOrg.test(url)) {
      url = url.replace(prdOrg, "https://www.arcgis.com");
    } else if (devextOrg.test(url)) {
      url = url.replace(devextOrg, "https://devext.arcgis.com");
    } else if (qaOrg.test(url)) {
      url = url.replace(qaOrg, "https://qaext.arcgis.com");
    }

    return url;
  }

  function formatStyle(style, styleUrl, metadata, token) {
    // transforms style object in place and also returns it

    // modify each source in style.sources
    const sourcesKeys = Object.keys(style.sources);

    for (let sourceIndex = 0; sourceIndex < sourcesKeys.length; sourceIndex++) {
      const source = style.sources[sourcesKeys[sourceIndex]];

      // if a relative path is referenced, the default style can be found in a standard location
      if (source.url.indexOf("http") === -1) {
        source.url = styleUrl.replace("/resources/styles/root.json", "");
      }

      // a trailing "/" may create invalid paths
      if (source.url.charAt(source.url.length - 1) === "/") {
        source.url = source.url.slice(0, source.url.length - 1);
      }

      // add tiles property if missing
      if (!source.tiles) {
        // right now ArcGIS Pro published vector services have a slightly different signature
        // the '/' is needed in the URL string concatenation below for source.tiles
        if (metadata.tiles && metadata.tiles[0].charAt(0) !== "/") {
          metadata.tiles[0] = `/${metadata.tiles[0]}`;
        }

        source.tiles = [source.url + metadata.tiles[0]];
      }

      // some VectorTileServer endpoints may default to returning f=html,
      // specify f=json to account for that behavior
      source.url += "?f=json";

      // add the token to the source url and tiles properties as a query param
      source.url += token ? `&token=${token}` : "";
      source.tiles[0] += token ? `?token=${token}` : "";
      // add minzoom and maxzoom to each source based on the service metadata
      // prefer minLOD/maxLOD if it exists since that is the level that tiles are cooked too
      // MapLibre will overzoom for LODs that are not cooked
      source.minzoom = metadata.minLOD || metadata.tileInfo.lods[0].level;
      source.maxzoom =
        metadata.maxLOD ||
        metadata.tileInfo.lods[metadata.tileInfo.lods.length - 1].level;
    }

    // add the attribution and copyrightText properties to the last source in style.sources based on the service metadata
    const lastSource = style.sources[sourcesKeys[sourcesKeys.length - 1]];
    lastSource.attribution = metadata.copyrightText || "";
    lastSource.copyrightText = metadata.copyrightText || "";

    // if any layer in style.layers has a layout.text-font property (it will be any array of strings) remove all items in the array after the first
    for (let layerIndex = 0; layerIndex < style.layers.length; layerIndex++) {
      const layer = style.layers[layerIndex];
      if (
        layer.layout &&
        layer.layout["text-font"] &&
        layer.layout["text-font"].length > 1
      ) {
        layer.layout["text-font"] = [layer.layout["text-font"][0]];
      }
    }

    if (style.sprite && style.sprite.indexOf("http") === -1) {
      // resolve absolute URL for style.sprite
      style.sprite = styleUrl.replace(
        "styles/root.json",
        style.sprite.replace("../", ""),
      );
    }

    // Convert the style.glyphs and style.sprite URLs to CDN URLs if possable
    if (style.glyphs) {
      style.glyphs = toCdnUrl(style.glyphs);
    }

    if (style.sprite) {
      style.sprite = toCdnUrl(style.sprite);
    }

    // a trailing "/" may create invalid paths
    if (style.sprite && token) {
      // add the token to the style.sprite property as a query param, only if same domain (for token security)
      if (isSameTLD(styleUrl, style.sprite)) {
        style.sprite += `?token=${token}`;
      } else {
        console.warn(
          "Passing a token but sprite URL is not on same base URL, so you must pass the token manually.",
        );
      }
    }

    if (style.glyphs && style.glyphs.indexOf("http") === -1) {
      // resolve absolute URL for style.glyphs
      style.glyphs = styleUrl.replace(
        "styles/root.json",
        style.glyphs.replace("../", ""),
      );
    }

    if (style.glyphs && token) {
      // add the token to the style.glyphs property as a query param
      if (isSameTLD(styleUrl, style.glyphs)) {
        style.glyphs += `?token=${token}`;
      } else {
        console.warn(
          "Passing a token but glyph URL is not on same base URL, so you must pass the token manually.",
        );
      }
    }

    return style;
  }

  /*
    utility to assist with dynamic attribution data
    used primarily by VectorBasemapLayer.js
  */
  function getAttributionData(url, map) {
    if (esriLeaflet.Support.cors) {
      esriLeaflet.request(url, {}, (error, attributions) => {
        if (error) {
          return;
        }
        map._esriAttributions = map._esriAttributions || [];
        for (let c = 0; c < attributions.contributors.length; c++) {
          const contributor = attributions.contributors[c];

          for (let i = 0; i < contributor.coverageAreas.length; i++) {
            const coverageArea = contributor.coverageAreas[i];
            const southWest = leaflet.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
            const northEast = leaflet.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
            map._esriAttributions.push({
              attribution: contributor.attribution,
              score: coverageArea.score,
              bounds: leaflet.latLngBounds(southWest, northEast),
              minZoom: coverageArea.zoomMin,
              maxZoom: coverageArea.zoomMax,
            });
          }
        }

        map._esriAttributions.sort((a, b) => b.score - a.score);

        // pass the same argument as the map's 'moveend' event
        const obj = { target: map };
        esriLeaflet.Util._updateMapAttribution(obj);
      });
    }
  }

  /*
    utility to check if a service's tileInfo spatial reference is in Web Mercator
    used primarily by VectorTileLayer.js
  */
  const WEB_MERCATOR_WKIDS = [3857, 102100, 102113];

  function isWebMercator(wkid) {
    return WEB_MERCATOR_WKIDS.indexOf(wkid) >= 0;
  }

  const EsriUtil = {
    formatStyle,
  };

  const setRTLTextPlugin = (url, callback, deferred) => {
    maplibregl__default["default"].setRTLTextPlugin(url, callback, deferred);
  };

  const MaplibreGLJSLayer = leaflet.Layer.extend({
    options: {
      updateInterval: 32,
      // How much to extend the overlay view (relative to map size)
      // e.g. 0.1 would be 10% of map view in each direction
      padding: 0.1,
      // whether or not to register the mouse and keyboard
      // events on the mapbox overlay
      interactive: false,
      // set the tilepane as the default pane to draw gl tiles
      pane: "tilePane",
    },

    initialize(options) {
      leaflet.setOptions(this, options);

      // setup throttling the update event when panning
      this._throttledUpdate = leaflet.Util.throttle(
        this._update,
        this.options.updateInterval,
        this,
      );
    },

    onAdd(map) {
      if (!this._container) {
        this._initContainer();
      }

      const paneName = this.getPaneName();
      map.getPane(paneName).appendChild(this._container);

      this._initGL();

      this._offset = this._map.containerPointToLayerPoint([0, 0]);

      // work around https://github.com/mapbox/mapbox-gl-leaflet/issues/47
      if (map.options.zoomAnimation) {
        leaflet.DomEvent.on(
          map._proxy,
          leaflet.DomUtil.TRANSITION_END,
          this._transitionEnd,
          this,
        );
      }
    },

    onRemove(map) {
      if (this._map._proxy && this._map.options.zoomAnimation) {
        leaflet.DomEvent.off(
          this._map._proxy,
          leaflet.DomUtil.TRANSITION_END,
          this._transitionEnd,
          this,
        );
      }

      const paneName = this.getPaneName();

      map.getPane(paneName).removeChild(this._container);
      this._container = null;

      this._glMap.remove();
      this._glMap = null;
    },

    getEvents() {
      return {
        move: this._throttledUpdate, // sensibly throttle updating while panning
        zoomanim: this._animateZoom, // applies the zoom animation to the <canvas>
        zoom: this._pinchZoom, // animate every zoom event for smoother pinch-zooming
        zoomstart: this._zoomStart, // flag starting a zoom to disable panning
        zoomend: this._zoomEnd,
        resize: this._resize,
      };
    },

    getMaplibreMap() {
      return this._glMap;
    },

    getCanvas() {
      return this._glMap.getCanvas();
    },

    getSize() {
      return this._map.getSize().multiplyBy(1 + this.options.padding * 2);
    },

    getOpacity() {
      return this.options.opacity;
    },

    setOpacity(opacity) {
      this.options.opacity = opacity;
      this._container.style.opacity = opacity;
    },

    getBounds() {
      const halfSize = this.getSize().multiplyBy(0.5);
      const center = this._map.latLngToContainerPoint(this._map.getCenter());
      return leaflet.latLngBounds(
        this._map.containerPointToLatLng(center.subtract(halfSize)),
        this._map.containerPointToLatLng(center.add(halfSize)),
      );
    },

    getContainer() {
      return this._container;
    },

    // returns the pane name set in options if it is a valid pane, defaults to tilePane
    getPaneName() {
      return this._map.getPane(this.options.pane)
        ? this.options.pane
        : "tilePane";
    },

    _resize() {
      return this._glMap._resize;
    },

    _initContainer() {
      if (this._container) {
        return;
      }

      this._container = leaflet.DomUtil.create("div", "leaflet-gl-layer");

      const size = this.getSize();
      const offset = this._map.getSize().multiplyBy(this.options.padding);
      this._container.style.width = `${size.x}px`;
      this._container.style.height = `${size.y}px`;

      const topLeft = this._map
        .containerPointToLayerPoint([0, 0])
        .subtract(offset);

      leaflet.DomUtil.setPosition(this._container, topLeft);
    },

    _initGL() {
      if (this._glMap) {
        return;
      }

      const center = this._map.getCenter();

      const options = leaflet.extend({}, this.options, {
        container: this._container,
        center: [center.lng, center.lat],
        zoom: this._map.getZoom() - 1,
        attributionControl: false,
      });

      this._glMap = new maplibregl__default["default"].Map(options);

      // Listen for style data error (401 Unauthorized)
      this._glMap.on("error", (error) => {
        if (error.error && error.error.status === 401) {
          console.warn(
            "Invalid or expired API key. Please check that API key is not expired and has the basemaps privilege assigned.",
          );
        }
      });

      // Fire event for Maplibre "styledata" event.
      this._glMap.once("styledata", () => {
        this.fire("styleLoaded");
      });

      // allow GL base map to pan beyond min/max latitudes
      this._glMap.transform.latRange = null;
      this._glMap.transform.maxValidLatitude = Infinity;

      this._transformGL(this._glMap);

      if (this._glMap._canvas.canvas) {
        // older versions of mapbox-gl surfaced the canvas differently
        this._glMap._actualCanvas = this._glMap._canvas.canvas;
      } else {
        this._glMap._actualCanvas = this._glMap._canvas;
      }

      // treat child <canvas> element like L.ImageOverlay
      const canvas = this._glMap._actualCanvas;
      leaflet.DomUtil.addClass(canvas, "leaflet-image-layer");
      leaflet.DomUtil.addClass(canvas, "leaflet-zoom-animated");
      if (this.options.interactive) {
        leaflet.DomUtil.addClass(canvas, "leaflet-interactive");
      }
      if (this.options.className) {
        leaflet.DomUtil.addClass(canvas, this.options.className);
      }
    },

    _update() {
      // update the offset, so we can correct for it later when we zoom
      this._offset = this._map.containerPointToLayerPoint([0, 0]);

      if (this._zooming) {
        return;
      }

      const size = this.getSize();
      const container = this._container;
      const gl = this._glMap;
      const offset = this._map.getSize().multiplyBy(this.options.padding);
      const topLeft = this._map
        .containerPointToLayerPoint([0, 0])
        .subtract(offset);

      leaflet.DomUtil.setPosition(container, topLeft);

      this._transformGL(gl);

      if (gl.transform.width !== size.x || gl.transform.height !== size.y) {
        container.style.width = `${size.x}px`;
        container.style.height = `${size.y}px`;
        if (gl._resize !== null && gl._resize !== undefined) {
          gl._resize();
        } else {
          gl.resize();
        }
      } else {
        // older versions of mapbox-gl surfaced update publicly
        gl._update();
      }
    },

    _transformGL(gl) {
      const center = this._map.getCenter();

      // gl.setView([center.lat, center.lng], this._map.getZoom() - 1, 0);
      // calling setView directly causes sync issues because it uses requestAnimFrame

      const tr = gl.transform;
      tr.center = maplibregl__default["default"].LngLat.convert([center.lng, center.lat]);
      tr.zoom = this._map.getZoom() - 1;
    },

    // update the map constantly during a pinch zoom
    _pinchZoom() {
      this._glMap.jumpTo({
        zoom: this._map.getZoom() - 1,
        center: this._map.getCenter(),
      });
    },

    // borrowed from L.ImageOverlay
    // https://github.com/Leaflet/Leaflet/blob/master/src/layer/ImageOverlay.js#L139-L144
    _animateZoom(e) {
      const scale = this._map.getZoomScale(e.zoom);
      const padding = this._map
        .getSize()
        .multiplyBy(this.options.padding * scale);
      const viewHalf = this.getSize()._divideBy(2);
      // corrections for padding (scaled), adapted from
      // https://github.com/Leaflet/Leaflet/blob/master/src/map/Map.js#L1490-L1508
      const topLeft = this._map
        .project(e.center, e.zoom)
        ._subtract(viewHalf)
        ._add(this._map._getMapPanePos().add(padding))
        ._round();
      const offset = this._map
        .project(this._map.getBounds().getNorthWest(), e.zoom)
        ._subtract(topLeft);

      leaflet.DomUtil.setTransform(
        this._glMap._actualCanvas,
        offset.subtract(this._offset),
        scale,
      );
    },

    _zoomStart() {
      this._zooming = true;
    },

    _zoomEnd() {
      const scale = this._map.getZoomScale(this._map.getZoom());

      leaflet.DomUtil.setTransform(this._glMap._actualCanvas, null, scale);

      this._zooming = false;

      this._update();
    },

    _transitionEnd() {
      leaflet.Util.requestAnimFrame(function () {
        const zoom = this._map.getZoom();
        const center = this._map.getCenter();
        const offset = this._map.latLngToContainerPoint(
          this._map.getBounds().getNorthWest(),
        );

        // reset the scale and offset
        leaflet.DomUtil.setTransform(this._glMap._actualCanvas, offset, 1);

        // enable panning once the gl map is ready again
        this._glMap.once(
          "moveend",
          leaflet.Util.bind(function () {
            this._zoomEnd();
          }, this),
        );

        // update the map position
        this._glMap.jumpTo({
          center,
          zoom: zoom - 1,
        });
      }, this);
    },
  });

  function maplibreGLJSLayer(options) {
    return new MaplibreGLJSLayer(options);
  }

  const VectorTileLayer = leaflet.Layer.extend({
    options: {
      // if portalUrl is not provided, default to ArcGIS Online
      portalUrl: "https://www.arcgis.com",
      // for performance optimization default to `false`
      // set to `true` to resolve printing issues in Firefox
      preserveDrawingBuffer: false,
    },

    /**
     * Populates "this.options" to be used in the rest of the module and creates the layer instance.
     *
     * @param {string} key an ITEM ID or SERVICE URL
     * @param {object} options optional
     */
    initialize(key, options) {
      if (options) {
        leaflet.setOptions(this, options);
      }

      // support outdated casing apiKey of apikey
      if (this.options.apiKey) {
        this.options.apikey = this.options.apiKey;
      }

      // if apiKey is passed in, propagate to token
      // if token is passed in, propagate to apiKey
      if (this.options.apikey) {
        this.options.token = this.options.apikey;
      } else if (this.options.token) {
        this.options.apikey = this.options.token;
      }

      // if no key passed in
      if (!key) {
        throw new Error(
          "An ITEM ID or SERVICE URL is required for vectorTileLayer.",
        );
      }

      // set key onto "this.options" for use elsewhere in the module.
      if (key) {
        this.options.key = key;
      }

      // this.options has been set, continue on to create the layer:
      this._createLayer();
    },

    /**
     * Creates the maplibreGLJSLayer given using "this.options"
     */
    _createLayer() {
      loadStyle(
        this.options.key,
        this.options,
        (error, style, styleUrl, service) => {
          if (error) {
            this.fire("load-error", {
              value: error,
            });
            return;
          }

          if (!isWebMercator(service.tileInfo.spatialReference.wkid)) {
            console.warn(
              'This layer is not guaranteed to display properly because its service does not use the Web Mercator projection. The "tileInfo.spatialReference" property is:',
              service.tileInfo.spatialReference,
              "\nMore information is available at https://github.com/maplibre/maplibre-gl-js/issues/168 and https://github.com/Esri/esri-leaflet-vector/issues/94.",
            );
          }

          // once style object is loaded it must be transformed to be compliant with maplibreGLJSLayer
          style = formatStyle(style, styleUrl, service, this.options.token);

          this._createMaplibreLayer(style);
        },
      );
    },

    _setupAttribution() {
      // if a custom attribution was not provided in the options,
      // then attempt to rely on the attribution of the last source in the style object
      // and add it to the map's attribution control
      // (otherwise it would have already been added by leaflet to the attribution control)
      if (!this.getAttribution()) {
        const sources =
          this._maplibreGL.getMaplibreMap().style.stylesheet.sources;
        const sourcesKeys = Object.keys(sources);
        this.options.attribution =
          sources[sourcesKeys[sourcesKeys.length - 1]].attribution;
        if (this._map && this._map.attributionControl) {
          // NOTE: if attribution is an empty string (or otherwise falsy) at this point it would not appear in the attribution control
          this._map.attributionControl.addAttribution(this.getAttribution());
        }
      }
    },

    _createMaplibreLayer(style) {
      this._maplibreGL = maplibreGLJSLayer({
        style,
        pane: this.options.pane,
        opacity: this.options.opacity,
        preserveDrawingBuffer: this.options.preserveDrawingBuffer,
      });

      this._ready = true;
      this.fire("ready", {}, true);

      this._maplibreGL.on("styleLoaded", () => {
        this._setupAttribution();
        // additionally modify the style object with the user's optional style override function
        if (this.options.style && typeof this.options.style === "function") {
          this._maplibreGL._glMap.setStyle(
            this.options.style(this._maplibreGL._glMap.getStyle()),
          );
        }
      });
    },

    onAdd(map) {
      this._map = map;

      if (this._ready) {
        this._asyncAdd();
      } else {
        this.once(
          "ready",
          function () {
            this._asyncAdd();
          },
          this,
        );
      }
    },

    onRemove(map) {
      map.removeLayer(this._maplibreGL);
    },

    _asyncAdd() {
      const map = this._map;
      this._maplibreGL.addTo(map, this);
    },
  });

  function vectorTileLayer(key, options) {
    return new VectorTileLayer(key, options);
  }

  const POWERED_BY_ESRI_ATTRIBUTION_STRING =
    'Powered by <a href="https://www.esri.com">Esri</a>';

  const VectorBasemapLayer = VectorTileLayer.extend({
    /**
     * Populates "this.options" to be used in the rest of the module.
     *
     * @param {string} key
     * @param {object} options optional
     */
    initialize(key, options) {
      // Default to the v1 service endpoint
      if (!options.version) {
        if (key.includes("/")) {
          options.version = 2;
        } else {
          options.version = 1;
        }
      }
      if (!key) {
        // Default style enum if none provided
        key = options.version === 1 ? "ArcGIS:Streets" : "arcgis/streets";
      }
      // If no API Key or token is provided (support outdated casing apiKey of apikey)
      if (!(options.apikey || options.apiKey || options.token)) {
        throw new Error(
          "An API Key or token is required for vectorBasemapLayer.",
        );
      }
      // Validate v2 service params
      if (options.version !== 2) {
        if (options.language) {
          throw new Error(
            "The language parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.",
          );
        }
        if (options.worldview) {
          throw new Error(
            "The worldview parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.",
          );
        }
        if (options.places) {
          throw new Error(
            "The places parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.",
          );
        }
      }
      // Determine layer order
      if (!options.pane) {
        if (key.includes(":Label") || key.includes("/label")) {
          options.pane = "esri-labels";
        } else if (key.includes(":Detail") || key.includes("/detail")) {
          options.pane = "esri-detail";
        } else {
          // Create layer in the tilePane by default
          options.pane = "tilePane";
        }
      }

      // Options has been configured, continue on to create the layer:
      VectorTileLayer.prototype.initialize.call(this, key, options);
    },

    /**
     * Creates the maplibreGLJSLayer using "this.options"
     */
    _createLayer() {
      let styleUrl;
      if (this.options.version && this.options.version === 2) {
        styleUrl = getBasemapStyleV2Url(this.options.key, this.options.apikey, {
          language: this.options.language,
          worldview: this.options.worldview,
          places: this.options.places,
          baseUrl: this.options.baseUrl,
        });
      } else {
        styleUrl = getBasemapStyleUrl(this.options.key, this.options.apikey);
      }
      // show error warning on successful response for previous version(1)
      if (this.options.version && this.options.version === 1) {
        fetch(styleUrl)
          .then((response) => response.json())
          .then((styleData) => {
            if (styleData.error) {
              console.warn("Error:", styleData.error.message);
            }
          })
          .catch((error) => {
            console.warn("Error:", error.message);
          });
      }
      this._createMaplibreLayer(styleUrl);
    },

    _setupAttribution() {
      if (this.options.key.length === 32) {
        // this is an itemId
        const sources =
          this._maplibreGL.getMaplibreMap().style.stylesheet.sources;
        const allAttributions = [];
        Object.keys(sources).forEach((key) => {
          allAttributions.push(sources[key].attribution);
          if (
            sources[key].copyrightText &&
            sources[key].copyrightText &&
            sources[key].copyrightText !== "" &&
            sources[key].attribution !== sources[key].copyrightText
          ) {
            allAttributions.push(sources[key].copyrightText);
          }
        });

        // In the case of an enum, since the attribution is dynamic, Esri Leaflet
        // will add the "Powered by Esri" string. But in this case we are not
        // dynamic so we must add it ourselves.
        this._map.attributionControl.addAttribution(
          `<span class="esri-dynamic-attribution">${POWERED_BY_ESRI_ATTRIBUTION_STRING} | ${allAttributions.join(
          ", ",
        )}</span>`,
        );
      } else {
        // setup dynamic attribution
        esriLeaflet.Util.setEsriAttribution(this._map);

        // this is an enum
        if (!this.options.attributionUrls) {
          this.options.attributionUrls = this._getAttributionUrls(
            this.options.key,
          );
        }

        if (this._map && this.options.attributionUrls) {
          if (this._map.attributionControl) {
            for (
              let index = 0;
              index < this.options.attributionUrls.length;
              index++
            ) {
              const attributionUrl = this.options.attributionUrls[index];
              getAttributionData(attributionUrl, this._map);
            }

            this._map.attributionControl.addAttribution(
              '<span class="esri-dynamic-attribution"></span>',
            );
          }
          esriLeaflet.Util._updateMapAttribution({ target: this._map });
        }
      }
    },

    /**
     * Given a key, return the attribution url(s).
     * @param {string} key
     */
    _getAttributionUrls(key) {
      if (key.indexOf("OSM:") === 0 || key.indexOf("osm/") === 0) {
        return ["https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2"];
      } else if (
        key.indexOf("ArcGIS:Imagery") === 0 ||
        key.indexOf("arcgis/imagery") === 0
      ) {
        return [
          "https://static.arcgis.com/attribution/World_Imagery",
          "https://static.arcgis.com/attribution/Vector/World_Basemap_v2",
        ];
      }

      // default:
      return ["https://static.arcgis.com/attribution/Vector/World_Basemap_v2"];
    },

    _initPane() {
      if (!this._map.getPane(this.options.pane)) {
        const pane = this._map.createPane(this.options.pane);
        pane.style.pointerEvents = "none";

        let zIndex = 500;
        if (this.options.pane === "esri-detail") {
          zIndex = 250;
        } else if (this.options.pane === "esri-labels") {
          zIndex = 300;
        }
        pane.style.zIndex = zIndex;
      }
    },

    onRemove(map) {
      map.off("moveend", esriLeaflet.Util._updateMapAttribution);
      map.removeLayer(this._maplibreGL);

      if (map.attributionControl) {
        if (esriLeaflet.Util.removeEsriAttribution) {
          esriLeaflet.Util.removeEsriAttribution(map);
        }

        const element = document.getElementsByClassName(
          "esri-dynamic-attribution",
        );

        if (element && element.length > 0) {
          const vectorAttribution = element[0].outerHTML;
          // call removeAttribution twice here
          // this is needed due to the 2 different ways that addAttribution is called inside _setupAttribution.
          // leaflet attributionControl.removeAttribution method ignore a call when the attribution sent is not present there
          map.attributionControl.removeAttribution(vectorAttribution);
          map.attributionControl.removeAttribution(
            '<span class="esri-dynamic-attribution"></span>',
          );
        }
      }
    },

    _asyncAdd() {
      const map = this._map;
      this._initPane();
      map.on("moveend", esriLeaflet.Util._updateMapAttribution);
      this._maplibreGL.addTo(map, this);
    },
  });

  function vectorBasemapLayer(key, options) {
    return new VectorBasemapLayer(key, options);
  }

  // export version
  const version = packageInfo.version;

  exports.MaplibreGLJSLayer = MaplibreGLJSLayer;
  exports.Util = EsriUtil;
  exports.VERSION = version;
  exports.VectorBasemapLayer = VectorBasemapLayer;
  exports.VectorTileLayer = VectorTileLayer;
  exports.maplibreGLJSLayer = maplibreGLJSLayer;
  exports.setRTLTextPlugin = setRTLTextPlugin;
  exports.vectorBasemapLayer = vectorBasemapLayer;
  exports.vectorTileLayer = vectorTileLayer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=esri-leaflet-vector-debug.js.map
