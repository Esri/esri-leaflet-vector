import { Layer, setOptions } from 'leaflet';
import { loadStyle, formatStyle, isWebMercator } from './Util';
import { mapboxGLJSLayer } from './MapBoxGLLayer';

export var VectorTileLayer = Layer.extend({
  options: {
    // if pane is not provided, default to LeafletJS's overlayPane
    // https://leafletjs.com/reference.html#map-pane
    pane: 'overlayPane',

    // if portalUrl is not provided, default to ArcGIS Online
    portalUrl: 'https://www.arcgis.com',

    // flag to use baseUrl and stylePath options (defaults below)
    useCustomUrlOrPath: false,

    // if baseUrl is not provided, default path to items on ArcGIS Online
    baseUrl: 'https://www.arcgis.com/sharing/rest/content/items',

    // if stylePath is not provided, default ArcGIS Online stylePath
    stylePath: 'resources/styles/root.json'
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

    // if apiKey is passed in, use it as a token
    // (opposite from VectorBasemapLayer.js)
    if (this.options.apikey) {
      this.options.token = this.options.apikey;
    }

    // if no key passed in
    if (!key) {
      throw new Error('An ITEM ID or SERVICE URL is required for vectorTileLayer.');
    }

    // set key onto "this.options" for use elsewhere in the module.
    if (key) {
      this.options.key = key;
    }

    // this.options has been set, continue on to create the layer:
    this._createLayer();
  },

  /**
   * Creates the mapboxGLJSLayer given using "this.options"
   */
  _createLayer: function () {
    loadStyle(
      this.options.key,
      this.options,
      function (error, style, styleUrl, service) {
        if (error) {
          if (this.options.errorCallback) {
            this.options.errorCallback(error);
            return;
          } else {
            throw new Error(error);
          }
        }

        if (!style.sources) {
          if (this.options.errorCallback) {
            this.options.errorCallback('incorrect style path detected');
            return;
          } else {
            throw new Error('incorrect style path detected');
          }
        }

        if (!isWebMercator(service.tileInfo.spatialReference.wkid)) {
          console.warn(
            'This layer is not guaranteed to display properly because its service does not use the Web Mercator projection. The "tileInfo.spatialReference" property is:',
            service.tileInfo.spatialReference,
            '\nMore information is available at https://docs.mapbox.com/help/glossary/projection/ and https://github.com/Esri/esri-leaflet-vector/issues/94.'
          );
        }

        // once style object is loaded it must be transformed to be compliant with mapboxGLJSLayer
        style = formatStyle(style, styleUrl, service, this.options.token);

        // if a custom attribution was not provided in the options,
        // then attempt to rely on the attribution of the last source in the style object
        // and add it to the map's attribution control
        // (otherwise it would have already been added by leaflet to the attribution control)
        if (!this.getAttribution()) {
          var sourcesKeys = Object.keys(style.sources);
          this.options.attribution = style.sources[sourcesKeys[sourcesKeys.length - 1]].attribution;
          if (this._map && this._map.attributionControl) {
            // NOTE: if attribution is an empty string (or otherwise falsy) at this point it would not appear in the attribution control
            this._map.attributionControl.addAttribution(this.getAttribution());
          }
        }

        // additionally modify the style object with the user's optional style override function
        if (this.options.style && typeof this.options.style === 'function') {
          style = this.options.style(style);
        }

        this._mapboxGL = mapboxGLJSLayer({
          style: style,
          pane: this.options.pane,
          opacity: this.options.opacity
        });

        this._ready = true;
        this.fire('ready', {}, true);
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
    if (this._mapboxGL) {
      map.removeLayer(this._mapboxGL);
    }
  },

  _asyncAdd: function () {
    var map = this._map;
    this._mapboxGL.addTo(map, this);
  }
});

export function vectorTileLayer (key, options) {
  return new VectorTileLayer(key, options);
}

export default vectorTileLayer;
