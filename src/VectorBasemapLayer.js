import { Layer, extend } from 'leaflet';
import { Util } from 'esri-leaflet';
import { getBasemapStyleUrl, getAttributionData } from './Util';
import { mapboxGLJSLayer } from './MapBoxGLLayer';

export var VectorBasemapLayer = Layer.extend({
  options: {
    key: 'ArcGIS:Streets' // default style key enum if none provided
  },

  /**
   * Populates "this.options" to be used in the rest of the module.
   *
   * @param {string} key
   * @param {object} options optional
   */
  initialize: function (key, options) {
    if (options) {
      // merge options into "this.options" (the default we set above)
      extend(this.options, options);
    }

    // if token is passed in, use it as an apiKey
    if (this.options.token) {
      this.options.apiKey = this.options.token;
    }

    // If no key passed in, or if the key is a named basemap enum, must include apiKey (or token) option
    if ((!key || (key && (key.indexOf('ArcGIS:') === 0 || key.indexOf('OSM:') === 0))) && !this.options.apiKey) {
      throw new Error('API Key or token is required for vectorBasemapLayer.');
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
    var styleUrl = getBasemapStyleUrl(this.options.key, this.options.apiKey);

    this._mapboxGL = mapboxGLJSLayer({
      style: styleUrl,
      pane: this.options.pane,
      opacity: this.options.opacity
    });

    this._ready = true;
    this.fire('ready', {}, true);

    this._mapboxGL.on('styleLoaded', function (res) {
      this._setupAttribution();
    }.bind(this));
  },

  _setupAttribution: function () {
    var map = this._map;

    if (this.options.key.length === 32) {
      // this is an itemId
      var sources = this._mapboxGL.getMapboxMap().style.stylesheet.sources;
      var allAttributions = [];
      Object.keys(sources).forEach(function (key) {
        allAttributions.push(sources[key].attribution);
        if (sources[key].copyrightText && sources[key].copyrightText && sources[key].copyrightText !== '' && sources[key].attribution !== sources[key].copyrightText) {
          allAttributions.push(sources[key].copyrightText);
        }
      });

      map.attributionControl.addAttribution('<span class="">' + allAttributions.join(', ') + '</span>');
    } else {
      // this is an enum
      if (!this.options.attributionUrls) {
        this.options.attributionUrls = this._getAttributionUrls(this.options.key);
      }

      if (this._map && this.options.attributionUrls) {
        Util.setEsriAttribution(map);

        if (this._map.attributionControl) {
          for (
            let index = 0;
            index < this.options.attributionUrls.length;
            index++
          ) {
            const attributionUrl = this.options.attributionUrls[index];
            getAttributionData(attributionUrl, map);
          }

          map.attributionControl.addAttribution(
            '<span class="esri-dynamic-attribution"></span>'
          );
        }
        Util._updateMapAttribution({ target: this._map });
      }
    }
  },

  /**
   * Given a key, return the attribution url(s).
   * @param {string} key
   */
  _getAttributionUrls: function (key) {
    if (key.indexOf('OSM:') === 0) {
      return ['https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2'];
    } else if (key.indexOf('ArcGIS:Imagery') === 0) {
      return [
        'https://static.arcgis.com/attribution/World_Imagery',
        'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
      ];
    }

    // default:
    return ['https://static.arcgis.com/attribution/Vector/World_Basemap_v2'];
  },

  onAdd: function (map) {
    this._map = map;

    this._initPane();

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

  _initPane: function () {
    // if the layer is a "label" layer, should use the "esri-label" pane.
    if (!this.options.pane) {
      if (this.options.key.indexOf(':Labels') > -1) {
        this.options.pane = 'esri-labels';
      } else {
        this.options.pane = 'tilePane';
      }
    }

    if (!this._map.getPane(this.options.pane)) {
      var pane = this._map.createPane(this.options.pane);
      pane.style.pointerEvents = 'none';
      pane.style.zIndex = this.options.pane === 'esri-labels' ? 550 : 500;
    }
  },

  onRemove: function (map) {
    map.off('moveend', Util._updateMapAttribution);
    map.removeLayer(this._mapboxGL);

    if (map.attributionControl) {
      var element = document.getElementsByClassName('esri-dynamic-attribution');

      if (element && element.length > 0) {
        var vectorAttribution = element[0].outerHTML;
        // this doesn't work, not sure why.
        map.attributionControl.removeAttribution(vectorAttribution);
      }
    }
  },

  _asyncAdd: function () {
    var map = this._map;
    map.on('moveend', Util._updateMapAttribution);
    this._mapboxGL.addTo(map, this);
  }
});

export function vectorBasemapLayer (key, options) {
  return new VectorBasemapLayer(key, options);
}

export default VectorBasemapLayer;
