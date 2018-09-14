/* esri-leaflet-vector - v2.0.1 - Fri Sep 14 2018 09:34:32 GMT-0700 (PDT)
 * Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet'), require('mapbox-gl'), require('esri-leaflet')) :
  typeof define === 'function' && define.amd ? define(['exports', 'leaflet', 'mapbox-gl', 'esri-leaflet'], factory) :
  (factory((global.L = global.L || {}, global.L.esri = global.L.esri || {}, global.L.esri.Vector = {}),global.L,global.mapboxgl,global.L.esri));
}(this, (function (exports,L$1,mapboxGl,esriLeaflet) { 'use strict';

  L$1 = L$1 && L$1.hasOwnProperty('default') ? L$1['default'] : L$1;

  var version = "2.0.1";

  L.MapboxGL = L.Layer.extend({
      options: {
        updateInterval: 32
      },

      initialize: function (options) {
          L.setOptions(this, options);

          if (options.accessToken) {
              mapboxgl.accessToken = options.accessToken;
          } else {
              throw new Error('You should provide a Mapbox GL access token as a token option.');
          }

           /**
           * Create a version of `fn` that only fires once every `time` millseconds.
           *
           * @param {Function} fn the function to be throttled
           * @param {number} time millseconds required between function calls
           * @param {*} context the value of `this` with which the function is called
           * @returns {Function} debounced function
           * @private
           */
          var throttle = function (fn, time, context) {
              var lock, args, wrapperFn, later;

              later = function () {
                  // reset lock and call if queued
                  lock = false;
                  if (args) {
                      wrapperFn.apply(context, args);
                      args = false;
                  }
              };

              wrapperFn = function () {
                  if (lock) {
                      // called too soon, queue to call later
                      args = arguments;

                  } else {
                      // call and lock until later
                      fn.apply(context, arguments);
                      setTimeout(later, time);
                      lock = true;
                  }
              };

              return wrapperFn;
          };

          // setup throttling the update event when panning
          this._throttledUpdate = throttle(L.Util.bind(this._update, this), this.options.updateInterval);
      },

      onAdd: function (map) {
          if (!this._glContainer) {
              this._initContainer();
          }

          map._panes.tilePane.appendChild(this._glContainer);

          this._initGL();

          this._offset = this._map.containerPointToLayerPoint([0, 0]);

          // work around https://github.com/mapbox/mapbox-gl-leaflet/issues/47
          if (map.options.zoomAnimation) {
              L.DomEvent.on(map._proxy, L.DomUtil.TRANSITION_END, this._transitionEnd, this);
          }
      },

      onRemove: function (map) {
          if (this._map.options.zoomAnimation) {
              L.DomEvent.off(this._map._proxy, L.DomUtil.TRANSITION_END, this._transitionEnd, this);
          }

          map.getPanes().tilePane.removeChild(this._glContainer);
          this._glMap.remove();
          this._glMap = null;
      },

      getEvents: function () {
          return {
              move: this._throttledUpdate, // sensibly throttle updating while panning
              zoomanim: this._animateZoom, // applys the zoom animation to the <canvas>
              zoom: this._pinchZoom, // animate every zoom event for smoother pinch-zooming
              zoomstart: this._zoomStart, // flag starting a zoom to disable panning
              zoomend: this._zoomEnd
          };
      },

      _initContainer: function () {
          var container = this._glContainer = L.DomUtil.create('div', 'leaflet-gl-layer');

          var size = this._map.getSize();
          container.style.width  = size.x + 'px';
          container.style.height = size.y + 'px';
      },

      _initGL: function () {
          var center = this._map.getCenter();

          var options = L.extend({}, this.options, {
              container: this._glContainer,
              interactive: false,
              center: [center.lng, center.lat],
              zoom: this._map.getZoom() - 1,
              attributionControl: false
          });

          this._glMap = new mapboxgl.Map(options);

          // allow GL base map to pan beyond min/max latitudes
          this._glMap.transform.latRange = null;

          if (this._glMap._canvas.canvas) {
              // older versions of mapbox-gl surfaced the canvas differently
              this._glMap._actualCanvas = this._glMap._canvas.canvas;
          } else {
              this._glMap._actualCanvas = this._glMap._canvas;
          }

          // treat child <canvas> element like L.ImageOverlay
          L.DomUtil.addClass(this._glMap._actualCanvas, 'leaflet-image-layer');
          L.DomUtil.addClass(this._glMap._actualCanvas, 'leaflet-zoom-animated');

      },

      _update: function (e) {
          // update the offset so we can correct for it later when we zoom
          this._offset = this._map.containerPointToLayerPoint([0, 0]);

          if (this._zooming) {
            return;
          }

          var size = this._map.getSize(),
              container = this._glContainer,
              gl = this._glMap,
              topLeft = this._map.containerPointToLayerPoint([0, 0]);

          L.DomUtil.setPosition(container, topLeft);

          var center = this._map.getCenter();

          // gl.setView([center.lat, center.lng], this._map.getZoom() - 1, 0);
          // calling setView directly causes sync issues because it uses requestAnimFrame

          var tr = gl.transform;
          tr.center = mapboxgl.LngLat.convert([center.lng, center.lat]);
          tr.zoom = this._map.getZoom() - 1;

          if (gl.transform.width !== size.x || gl.transform.height !== size.y) {
              container.style.width  = size.x + 'px';
              container.style.height = size.y + 'px';
              if (gl._resize !== null && gl._resize !== undefined){
                  gl._resize();
              } else {
                  gl.resize();
              }
          } else {
              // older versions of mapbox-gl surfaced update publicly
              if (gl._update !== null && gl._update !== undefined){
                  gl._update();
              } else {
                  gl.update();
              }
          }
      },

      // update the map constantly during a pinch zoom
      _pinchZoom: function (e) {
        this._glMap.jumpTo({
          zoom: this._map.getZoom() - 1,
          center: this._map.getCenter()
        });
      },

      // borrowed from L.ImageOverlay https://github.com/Leaflet/Leaflet/blob/master/src/layer/ImageOverlay.js#L139-L144
      _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), e.zoom, e.center);

        L.DomUtil.setTransform(this._glMap._actualCanvas, offset.subtract(this._offset), scale);
      },

      _zoomStart: function (e) {
        this._zooming = true;
      },

      _zoomEnd: function () {
        var scale = this._map.getZoomScale(this._map.getZoom()),
            offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), this._map.getZoom(), this._map.getCenter());

        L.DomUtil.setTransform(this._glMap._actualCanvas, offset.subtract(this._offset), scale);

        this._zooming = false;
      },

      _transitionEnd: function (e) {
        L.Util.requestAnimFrame(function () {
            var zoom = this._map.getZoom(),
            center = this._map.getCenter(),
            offset = this._map.latLngToContainerPoint(this._map.getBounds().getNorthWest());

            // reset the scale and offset
            L.DomUtil.setTransform(this._glMap._actualCanvas, offset, 1);

            // enable panning once the gl map is ready again
            this._glMap.once('moveend', L.Util.bind(function () {
                this._zoomEnd();
            }, this));

            // update the map position
            this._glMap.jumpTo({
                center: center,
                zoom: zoom - 1
            });
        }, this);
      }
  });

  L.mapboxGL = function (options) {
      return new L.MapboxGL(options);
  };

  function fetchMetadata (url, context) {
    esriLeaflet.request(url, {}, function (error, style) {
      if (!error) {
        esriLeaflet.request(style.sources.esri.url, {}, function (error, tileMetadata) {
          if (!error) {
            formatStyle(style, tileMetadata, url);
            context._mapboxGL = L$1.mapboxGL({
              accessToken: 'ezree',
              style: style
            });

            context._ready = true;
            context.fire('ready', {}, true);
          }
        }, context);
      } else {
        throw new Error('Unable to fetch vector tile style metadata');
      }
    }, context);
  }

  function formatStyle (style, metadata, styleUrl) {
    // if a relative path is referenced, the default style can be found in a standard location
    if (style.sources.esri.url && style.sources.esri.url.indexOf('http') === -1) {
      style.sources.esri.url = styleUrl.replace('/resources/styles/root.json', '');
    }

    // right now ArcGIS Pro published vector services have a slightly different signature
    if (metadata.tiles && metadata.tiles[0].charAt(0) !== '/') {
      metadata.tiles[0] = '/' + metadata.tiles[0];
    }

    if (metadata.tileMap && metadata.tileMap.charAt(0) !== '/') {
      metadata.tileMap = '/' + metadata.tileMap;
    }

    style.sources.esri = {
      type: 'vector',
      scheme: 'xyz',
      tilejson: metadata.tilejson || '2.0.0',
      format: (metadata.tileInfo && metadata.tileInfo.format) || 'pbf',
      index: metadata.tileMap ? style.sources.esri.url + metadata.tileMap : null,
      tiles: [
        style.sources.esri.url + metadata.tiles[0]
      ],
      description: metadata.description,
      name: metadata.name,
      /* mapbox-gl-js does not respect the indexing of esri tiles
      because we cache to different zoom levels depending on feature density. articifially capping at 15, but 404s will still be encountered when zooming in tight in rural areas.

      the *real* solution would be to make intermittent calls to our tilemap and update the maxzoom of the layer internally.

      reference implementation: https://github.com/openstreetmap/iD/pull/5029
      */
      maxzoom: 15
    };

    if (style.glyphs.indexOf('http') === -1) {
      // set paths to sprite and glyphs
      style.glyphs = styleUrl.replace('styles/root.json', style.glyphs.replace('../', ''));
      style.sprite = styleUrl.replace('styles/root.json', style.sprite.replace('../', ''));
    }
  }

  var Basemap = L$1.Layer.extend({
    statics: {
      URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/',
      URLSUFFIX: '/resources/styles/root.json',
      STYLES: {
        'OpenStreetMap': '3e1a00aeae81496587988075fe529f71',
        // v2
        'Streets': 'de26a3cf4cc9451298ea173c4b324736',
        'StreetsRelief': 'b266e6d17fc345b498345613930fbd76',
        // 7dc6cea0b1764a1f9af2e679f642f0f5 doesnt pass validation
        'Topographic': '7a6bf0e8cb5a418085e66c0485e74d19',
        // 86f556a2d1fd468181855a35e344567f doesnt pass validation
        'StreetsNight': '93554006894c45a88136127535878fca',
        'Newspaper': 'dfb04de5f3144a80bc3f9f336228d24a',
        'Navigation': '63c47b7177f946b49902c24129b87252',
        'Nova': '75f4dfdff19e445395653121a95a85db',
        'ColoredPencil': '4cf7e1fb9f254dcda9c8fbadb15cf0f8',
        'Hybrid': '30d6b8271e1849cd9c3042060001f425',
        'Gray': '291da5eab3a0412593b66d384379f89f', // no labels
        'DarkGray': '5e9b3685f4c24d8781073dd928ebda50', // no labels
        'HumanGeography': '2afe5b807fa74006be6363fd243ffb30', // no labels
        'HumanGeographyDetail': '97fa1365da1e43eabb90d0364326bc2d', // no labels
        'DarkHumanGeography': 'd7397603e9274052808839b70812be50' // no labels
        // 'ModernAntique': 'effe3475f05a4d608e66fd6eeb2113c0', // throws mismatched image size error
      }
    },

    initialize: function (options) {
      // L.Layer expects a JSON object literal to be passed in constructor
      options = {
        key: options
      };

      this._basemap = options.key;

      if (typeof options.key === 'string' && Basemap.STYLES[options.key]) {
        var url = Basemap.URLPREFIX + Basemap.STYLES[options.key] + Basemap.URLSUFFIX;
        fetchMetadata(url, this);
      } else {
        throw new Error('L.esri.Vector.Basemap: Invalid parameter. Use one of "DarkGray", "Gray", "Hybrid", "Navigation", "Streets", "StreetsNight", "StreetsRelief", "Topographic"');
      }
    },

    onAdd: function (map) {
      this._map = map;
      esriLeaflet.Util.setEsriAttribution(map);

      if (map.attributionControl) {
        if (this._basemap === 'OpenStreetMap') {
          map.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
          map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, map layer by Esri</span>');
        } else {
          esriLeaflet.Util._getAttributionData('https://static.arcgis.com/attribution/World_Street_Map', map);
          map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">USGS, NOAA</span>');
        }
      }

      if (this._ready) {
        this._asyncAdd();
      } else {
        this.once('ready', function () {
          this._asyncAdd();
        }, this);
      }
    },

    onRemove: function (map) {
      map.off('moveend', esriLeaflet.Util._updateMapAttribution);
      map.removeLayer(this._mapboxGL);

      if (map.attributionControl) {
        var vectorAttribution = document.getElementsByClassName('esri-dynamic-attribution')[0].outerHTML;
        // this doesn't work, not sure why.
        map.attributionControl.removeAttribution(vectorAttribution);
      }
    },

    _asyncAdd: function () {
      var map = this._map;
      // thought it was just me, but apparently its not easy to mixin two different styles
      // https://github.com/mapbox/mapbox-gl-js/issues/4000

      // set the background color of the map to the background color of the tiles
      map.getContainer().style.background = this._mapboxGL.options.style.layers[0].paint['background-color'] || '#e1e3d0';

      map.on('moveend', esriLeaflet.Util._updateMapAttribution);
      this._mapboxGL.addTo(map, this);
      // map._gl = this._mapboxGL;
    }
  });

  function basemap (key) {
    return new Basemap(key);
  }

  var Layer = L$1.Layer.extend({
    statics: {
      URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/'
    },

    initialize: function (options) {
      // L.Layer expects a JSON object literal to be passed in constructor
      options = {
        id: options
      };

      if (typeof options.id === 'string') {
        var itemMetadataUrl = Layer.URLPREFIX + options.id;
        var tileUrl;
        var styleUrl;

        esriLeaflet.request(itemMetadataUrl, {}, function (error, metadata) {
          if (!error) {
            tileUrl = metadata.url;

            // custom tileset published using ArcGIS Pro
            if (tileUrl.indexOf('basemaps.arcgis.com') === -1) {
              this._customTileset = true;
              // if copyright info was published, display it.
              if (metadata.accessInformation) {
                this._copyrightText = metadata.accessInformation;
              }
              esriLeaflet.request(tileUrl, {}, function (error, tileMetadata) {
                if (!error) {
                  // right now ArcGIS Pro published vector services have a slightly different signature
                  if (tileMetadata.defaultStyles.charAt(0) !== '/') {
                    tileMetadata.defaultStyles = '/' + tileMetadata.defaultStyles;
                  }

                  styleUrl = tileUrl + tileMetadata.defaultStyles + '/root.json';
                  esriLeaflet.request(styleUrl, {}, function (error, style) {
                    if (!error) {
                      formatStyle(style, tileMetadata, styleUrl);

                      this._mapboxGL = L$1.mapboxGL({
                        accessToken: 'ezree',
                        style: style
                      });

                      this._ready = true;
                      this.fire('ready', {}, true);
                    }
                  }, this);
                }
              }, this);
            } else {
              // custom symbology applied to hosted basemap tiles
              fetchMetadata(itemMetadataUrl + '/resources/styles/root.json', this);
            }
          }
        }, this);
      } else {
        throw new Error('L.esri.Vector.Layer: Invalid parameter. Use the id of an ArcGIS Online vector tile item');
      }
    },

    onAdd: function (map) {
      this._map = map;
      esriLeaflet.Util.setEsriAttribution(map);

      if (this._ready) {
        this._asyncAdd();
      } else {
        this.once('ready', function () {
          this._asyncAdd();
        }, this);
      }
    },

    onRemove: function (map) {
      map.off('moveend', esriLeaflet.Util._updateMapAttribution);
      map.removeLayer(this._mapboxGL);

      if (map.attributionControl) {
        var vectorAttribution = document.getElementsByClassName('esri-dynamic-attribution')[0].outerHTML;
        // this doesn't work, not sure why.
        map.attributionControl.removeAttribution(vectorAttribution);
      }
    },

    _asyncAdd: function () {
      var map = this._map;
      if (map.attributionControl) {
        if (this._customTileset) {
          if (this._copyrightText) {
            // pull static copyright text for services published with Pro
            map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">' + this._copyrightText + '</span>');
          }
        } else {
          // provide dynamic attribution for Esri basemaps
          esriLeaflet.Util._getAttributionData('https://static.arcgis.com/attribution/World_Street_Map', map);
          map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">USGS, NOAA</span>');
          map.on('moveend', esriLeaflet.Util._updateMapAttribution);
        }
      }

      // set the background color of the map to the background color of the tiles
      map.getContainer().style.background = this._mapboxGL.options.style.layers[0].paint['background-color'];
      this._mapboxGL.addTo(map, this);
    }
  });

  function layer (id) {
    return new Layer(id);
  }

  exports.VERSION = version;
  exports.Basemap = Basemap;
  exports.basemap = basemap;
  exports.Layer = Layer;
  exports.layer = layer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=esri-leaflet-vector-debug.js.map
