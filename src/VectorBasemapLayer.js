import { Util } from 'esri-leaflet';
import { getBasemapStyleUrl, getAttributionData, getBasemapStyleV2Url } from './Util';
import { VectorTileLayer } from './VectorTileLayer';

export var VectorBasemapLayer = VectorTileLayer.extend({
  /**
   * Populates "this.options" to be used in the rest of the module.
   *
   * @param {string} key
   * @param {object} options optional
   */
  initialize: function (key, options) {
    // Default to the v1 service endpoint
    if (!options.version) {
      if (key.includes('/')) options.version = 2;
      else options.version = 1;
    }
    if (!key) {
      // Default style enum if none provided
      key = options.version === 1 ? 'ArcGIS:Streets' : 'arcgis/streets';
    }
    // If no API Key or token is provided (support outdated casing apiKey of apikey)
    if (!(options.apikey || options.apiKey || options.token)) {
      throw new Error('An API Key or token is required for vectorBasemapLayer.');
    }
    // Validate v2 service params
    if (options.version !== 2) {
      if (options.language) {
        throw new Error('The language parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.');
      }
      if (options.worldview) {
        throw new Error('The worldview parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.');
      }
      if (options.places) {
        throw new Error('The places parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.');
      }
    }
    // Determine layer order
    if (!options.pane) {
      if (key.includes(':Label') || key.includes('/label')) {
        options.pane = 'esri-labels';
      } else if (key.includes(':Detail') || key.includes('/detail')) {
        options.pane = 'esri-detail';
      } else {
        // Create layer in the tilePane by default
        options.pane = 'tilePane';
      }
    }

    // Options has been configured, continue on to create the layer:
    VectorTileLayer.prototype.initialize.call(this, key, options);
  },

  /**
   * Creates the maplibreGLJSLayer using "this.options"
   */
  _createLayer: function () {
    let styleUrl;
    if (this.options.version && this.options.version === 2) {
      styleUrl = getBasemapStyleV2Url(this.options.key, this.options.apikey, {
        language: this.options.language,
        worldview: this.options.worldview,
        places: this.options.places
      });
    } else {
      styleUrl = getBasemapStyleUrl(this.options.key, this.options.apikey);
    }
    // show error warning on successful response for previous version(1)
    if (this.options.version && this.options.version === 1) {
      fetch(styleUrl)
        .then(response => {
          return response.json();
        })
        .then(styleData => {
          if (styleData.error) {
            console.warn('Error:', styleData.error.message);
          }
        })
        .catch(error => {
          console.warn('Error:', error.message);
        });
    }
    this._createMaplibreLayer(styleUrl);
  },

  _setupAttribution: function () {
    // Set attribution
    Util.setEsriAttribution(this._map);

    if (this.options.key.length === 32) {
      // this is an itemId
      const sources = this._maplibreGL.getMaplibreMap().style.stylesheet.sources;
      const allAttributions = [];
      Object.keys(sources).forEach(function (key) {
        allAttributions.push(sources[key].attribution);
        if (sources[key].copyrightText && sources[key].copyrightText && sources[key].copyrightText !== '' && sources[key].attribution !== sources[key].copyrightText) {
          allAttributions.push(sources[key].copyrightText);
        }
      });

      this._map.attributionControl.addAttribution(`<span class="esri-dynamic-attribution">${allAttributions.join(', ')}</span>`);
    } else {
      // this is an enum
      if (!this.options.attributionUrls) {
        this.options.attributionUrls = this._getAttributionUrls(this.options.key);
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
    if (key.indexOf('OSM:') === 0 || (key.indexOf('osm/') === 0)) {
      return ['https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2'];
    } else if (key.indexOf('ArcGIS:Imagery') === 0 || key.indexOf('arcgis/imagery') === 0) {
      return [
        'https://static.arcgis.com/attribution/World_Imagery',
        'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
      ];
    }

    // default:
    return ['https://static.arcgis.com/attribution/Vector/World_Basemap_v2'];
  },

  _initPane: function () {
    if (!this._map.getPane(this.options.pane)) {
      const pane = this._map.createPane(this.options.pane);
      pane.style.pointerEvents = 'none';

      let zIndex = 500;
      if (this.options.pane === 'esri-detail') {
        zIndex = 250;
      } else if (this.options.pane === 'esri-labels') {
        zIndex = 300;
      }
      pane.style.zIndex = zIndex;
    }
  },

  onRemove: function (map) {
    map.off('moveend', Util._updateMapAttribution);
    map.removeLayer(this._maplibreGL);

    if (map.attributionControl) {
      if (Util.removeEsriAttribution) Util.removeEsriAttribution(map);

      const element = document.getElementsByClassName('esri-dynamic-attribution');

      if (element && element.length > 0) {
        const vectorAttribution = element[0].outerHTML;
        // call removeAttribution twice here
        // this is needed due to the 2 different ways that addAttribution is called inside _setupAttribution.
        // leaflet attributionControl.removeAttribution method ignore a call when the attribution sent is not present there
        map.attributionControl.removeAttribution(vectorAttribution);
        map.attributionControl.removeAttribution('<span class="esri-dynamic-attribution"></span>');
      }
    }
  },

  _asyncAdd: function () {
    const map = this._map;
    this._initPane();
    map.on('moveend', Util._updateMapAttribution);
    this._maplibreGL.addTo(map, this);
  }
});

export function vectorBasemapLayer (key, options) {
  return new VectorBasemapLayer(key, options);
}

export default vectorBasemapLayer;
