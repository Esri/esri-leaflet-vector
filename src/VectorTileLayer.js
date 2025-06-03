import { Layer, setOptions } from 'leaflet';
import { loadStyle, formatStyle, isWebMercator } from './Util';
import { maplibreGLJSLayer } from './MaplibreGLLayer';

export const VectorTileLayer = Layer.extend({
  options: {
    // if portalUrl is not provided, default to ArcGIS Online
    portalUrl: 'https://www.arcgis.com',
    // for performance optimization default to `false`
    // set to `true` to resolve printing issues in Firefox
    preserveDrawingBuffer: false
  },

  /**
   * Populates "this.options" to be used in the rest of the module and creates the layer instance.
   *
   * @param {string} key an ITEM ID or SERVICE URL
   * @param {object} options optional
   */
  initialize: function (key, options) {
    if (options) {
      setOptions(this, options);
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
        'An ITEM ID or SERVICE URL is required for vectorTileLayer.'
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
  _createLayer: function () {
    loadStyle(
      this.options.key,
      this.options,
      function (error, style, styleUrl, service) {
        if (error) {
          this.fire('load-error', {
            value: error
          });
          return;
        }

        if (!isWebMercator(service.tileInfo.spatialReference.wkid)) {
          console.warn(
            'This layer is not guaranteed to display properly because its service does not use the Web Mercator projection. The "tileInfo.spatialReference" property is:',
            service.tileInfo.spatialReference,
            '\nMore information is available at https://github.com/maplibre/maplibre-gl-js/issues/168 and https://github.com/Esri/esri-leaflet-vector/issues/94.'
          );
        }

        // once style object is loaded it must be transformed to be compliant with maplibreGLJSLayer
        style = formatStyle(style, styleUrl, service, this.options.token);

        this._createMaplibreLayer(style);
      }.bind(this)
    );
  },

  _setupAttribution: function () {
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

  _createMaplibreLayer: function (style) {
    this._maplibreGL = maplibreGLJSLayer({
      style: style,
      pane: this.options.pane,
      opacity: this.options.opacity,
      preserveDrawingBuffer: this.options.preserveDrawingBuffer
    });

    this._ready = true;
    this.fire('ready', {}, true);

    this._maplibreGL.on(
      'styleLoaded',
      function () {
        this._setupAttribution();
        // additionally modify the style object with the user's optional style override function
        if (this.options.style && typeof this.options.style === 'function') {
          this._maplibreGL._glMap.setStyle(
            this.options.style(this._maplibreGL._glMap.getStyle())
          );
        }
      }.bind(this)
    );
  },

  onAdd: function (map) {
    this._map = map;

    if (this._ready) {
      this._asyncAdd();
    } else {
      this.once(
        'ready',
        function () {
          this._asyncAdd();
        },
        this
      );
    }
  },

  onRemove: function (map) {
    map.removeLayer(this._maplibreGL);
  },

  _asyncAdd: function () {
    const map = this._map;
    this._maplibreGL.addTo(map, this);
  }
});

export function vectorTileLayer (key, options) {
  return new VectorTileLayer(key, options);
}

export default vectorTileLayer;
